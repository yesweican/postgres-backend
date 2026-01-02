import * as videoRepository from "../repositories/video_repository.js";
import { AppError } from "../errors/app_error.js";

export const createVideo = async (data) => {
  return videoRepository.create(data);
};

export const getAllVideos = async () => {
  return videoRepository.findAll();
};

export const getVideoById = async (id) => {
  const video = await videoRepository.findById(id);
  if (!video) {
    throw new AppError("Video not found", 404);
  }
  return video;
};

export const updateVideo = async (videoId, userId, updates) => {
  const video = await videoRepository.findById(videoId);

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  if (video.creator !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return videoRepository.update(videoId, updates);
};

export const deleteVideo = async (videoId, userId) => {
  const video = await videoRepository.findById(videoId);

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  if (video.creator !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await videoRepository.remove(videoId);
};
