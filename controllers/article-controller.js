import * as articleService from "../services/article_service.js";
import { AppError } from "../errors/app_error.js";

const buildImageUrl = (req, filename) => {
  // This is the SINGLE place image_url is constructed
  return `${req.protocol}://${req.get("host")}/uploads/images/${filename}`;
};

export const createArticle = async (req, res, next) => {
  try {
    var imagePath;
    if (req.file) {
      //imagePath = `/uploads/images/${req.file.filename}`;
      imagePath = buildImageUrl(req, req.file.filename);
    }

    console.log("user id:", req.user);
    
    const article = await articleService.createArticle({
      title: req.body.title,
      details: req.body.details,
      attachment: imagePath,
      author: req.user.id,
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const { author } = req.query;

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const targetAuthor = author ?? currentUserId;

    const { total, rows } = await articleService.getArticles({
      currentUserId,
      targetAuthor,
      page,
      pageSize
    });

    res.status(200).json({
      page,
      pageSize,
      total,
      count: rows.length,
      results: rows
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    res.json(article);
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const updates = {
      title: req.body.title,
      details: req.body.details,
    };

    if (req.file) {
      //imagePath = `/uploads/images/${req.file.filename}`;
      updates.attachment = buildImageUrl(req, req.file.filename);
    }

    const article = await articleService.updateArticle(
      req.params.id,
      req.user.id,
      updates
    );

    res.json(article);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    await articleService.deleteArticle(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


export const searchArticles = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      throw new AppError("Search term is required", 400);
    }

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const { total, results } =
      await articleService.searchArticles(
        q,
        page,
        pageSize
      );

    res.status(200).json({
      page,
      pageSize,
      total,
      count: results.length,
      results
    });

  } catch (err) {
    next(err);
  }
};
