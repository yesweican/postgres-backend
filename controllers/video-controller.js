import * as videoService from "../services/video_service.js";
import { AppError } from "../errors/app_error.js";

const buildVideoUrl = (req, filename) => {
  // This is the SINGLE place video_url is constructed
  return `${req.protocol}://${req.get("host")}/uploads/videos/${filename}`;
};

export const createVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Video file is required", 400);
    }

    //const videoPath = `/uploads/videos/${req.file.filename}`;
    const videoPath = buildVideoUrl(req, req.file.filename);

    console.log("user id:", req.user);

    const video = await videoService.createVideo({
      title: req.body.title,
      description: req.body.description,
      video_url: videoPath,
      creator: req.user.id,
    });

    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

export const getMyVideos = async (req, res, next) => {
  try {
    const videos = await videoService.getMyVideos(req.user.id);
    res.json(videos);
  } catch (err) {
    next(err);
  }
};


export const getVideoById = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    res.json(video);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const updates = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.file) {
      //updates.video_url = `/uploads/videos/${req.file.filename}`;
      updates.video_url = buildVideoUrl(req, req.file.filename);
    }

    const video = await videoService.updateVideo(
      req.params.id,
      req.user.id,
      updates
    );

    res.json(video);
  } catch (err) {
    next(err);
  }
};

export const searchVideos = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      throw new AppError("Search query is required", 400);
    }

    const videos = await videoService.searchVideos(q);
    res.json(videos);
  } catch (err) {
    next(err);
  }
};


export const deleteVideo = async (req, res, next) => {
  try {
    await videoService.deleteVideo(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


