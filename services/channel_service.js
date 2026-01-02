import * as channelRepo from "../repositories/channel_repository.js";
import { AppError } from "../errors/app_error.js";

export const createChannel = async ({ name, description, owner }) => {
  if (!name) {
    throw new AppError("Channel name is required", 400);
  }

  return channelRepo.createChannel({ name, description, owner });
};

export const getChannelById = async (channelId) => {
  const channel = await channelRepo.getChannelById(channelId);

  if (!channel) {
    throw new AppError("Channel not found", 404);
  }

  return channel;
};

export const getMyChannels = async (userId) => {
  return channelRepo.getChannelsByOwner(userId);
};

export const updateChannel = async (channelId, userId, updates) => {
  const channel = await channelRepo.getChannelById(channelId);

  if (!channel) {
    throw new AppError("Channel not found", 404);
  }

  if (channel.owner !== userId) {
    throw new AppError("Not authorized to update this channel", 403);
  }

  return channelRepo.updateChannel(
    channelId,
    updates.name ?? null,
    updates.description ?? null
  );
};

export const deleteChannel = async (channelId, userId) => {
  const channel = await channelRepo.getChannelById(channelId);

  if (!channel) {
    throw new AppError("Channel not found", 404);
  }

  if (channel.owner !== userId) {
    throw new AppError("Not authorized to delete this channel", 403);
  }

  await channelRepo.deleteChannel(channelId);
};

