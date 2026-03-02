import * as articleRepository from "../repositories/article_repository.js";
import { AppError } from "../errors/app_error.js";

export const createArticle = async (data) => {
  return articleRepository.create(data);
};

export const getArticles = async ({
  currentUserId,
  targetAuthor,
  page,
  pageSize
}) => {
  const isSelfRequest = currentUserId === targetAuthor;

  const MAX_PUBLIC_WINDOW = 100;

  const offset = page * pageSize;

  if (!isSelfRequest) {
    if (offset >= MAX_PUBLIC_WINDOW) {
      return {
        total: MAX_PUBLIC_WINDOW,
        rows: []
      };
    }

    const allowedLimit = Math.min(
      pageSize,
      MAX_PUBLIC_WINDOW - offset
    );

    const total = await articleRepository.countByAuthorCapped(
      targetAuthor,
      MAX_PUBLIC_WINDOW
    );

    const rows = await articleRepository.findByAuthorPaginated(
      targetAuthor,
      offset,
      allowedLimit
    );

    return { total, rows };
  }

  // 🔓 Self request (no cap)
  const total = await articleRepository.countByAuthor(targetAuthor);

  const rows = await articleRepository.findByAuthorPaginated(
    targetAuthor,
    offset,
    pageSize
  );

  return { total, rows };
};

export const getArticleById = async (id) => {
  const article = await articleRepository.findById(id);
  if (!article) {
    throw new AppError("Article not found", 404);
  }
  return article;
};

export const updateArticle = async (articleId, userId, updates) => {
  const article = await articleRepository.findById(articleId);

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  if (article.author !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return articleRepository.update(articleId, updates);
};

export const deleteArticle = async (articleId, userId) => {
  const article = await articleRepository.findById(articleId);

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  if (article.author !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await articleRepository.remove(articleId);
};


// ===== Search Articles (NO author restriction, NO 100 window) =====
export const searchArticles = async (
  searchTerm,
  page,
  pageSize
) => {
  const offset = page * pageSize;

  const [total, results] = await Promise.all([
    articleRepository.countSearchArticles(searchTerm),
    articleRepository.searchArticles(
      searchTerm,
      pageSize,
      offset
    )
  ]);

  return { total, results };
};