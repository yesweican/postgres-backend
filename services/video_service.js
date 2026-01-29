import * as videoRepository from "../repositories/video_repository.js";
import * as channelRepository from "../repositories/channel_repository.js";
import { AppError } from "../errors/app_error.js";

export const createVideo = async (data) => {
  if(data.channelId) {
    /* ---------- Channel Ownership Check ---------- */
    const channel = await channelRepository.findById(data.channelId);
    if (!channel) {
      throw new AppError("Channel not found", 404);
    }

    if (channel.owner_id !== data.creator) {
      throw new AppError(
        "You are not authorized to upload videos to this channel",
        403
      );
    }
  }

  return videoRepository.create(data);
};



export const getMyVideos = async (userId) => {
  return videoRepository.findByCreator(userId);
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

   if(updates.channel_id) {
    /* ---------- Channel Ownership Check ---------- */
    const channel = await channelRepository.getChannelById(updates.channel_id);
    if (!channel) {
      throw new AppError("Channel not found", 404);
    }

      if (channel.owner !== userId) {
      throw new AppError(
        "You are not authorized to upload videos to this channel",
        403
      );
    }
  }

  return videoRepository.update(videoId, updates);
};

export const searchVideos = async (query) => {
  return videoRepository.search(query);
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
