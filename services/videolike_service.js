import * as videoLikeRepo from "../repositories/videolike_repository.js";

export const toggle = async (videoId, viewerId) => {
  const exists = await videoLikeRepo.exists(videoId, viewerId);

  if (exists) {
    await videoLikeRepo.remove(videoId, viewerId);
    return { liked: false };
  }

  await videoLikeRepo.create(videoId, viewerId);
  return { liked: true };
};

export const check = async (videoId, viewerId) => {
  return await videoLikeRepo.exists(videoId, viewerId);
};

export const count = async (videoId) => {
  return await videoLikeRepo.countByVideo(videoId);
};