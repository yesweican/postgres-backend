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

export const getMyArticles = async (req, res, next) => {
  try {
    const userid = req.user.id;

    if (!userid) {
      throw new AppError("User ID is required", 400);
    }

    const articles = await articleService.getMyArticles(userid);
    res.json(articles);
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
