import * as articleRepository from "../repositories/article_repository.js";
import { AppError } from "../errors/app_error.js";

export const createArticle = async (data) => {
  return articleRepository.create(data);
};

export const getMyArticles = async (userId) => {
  return articleRepository.findByAuthor(userId);
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
