import * as subRepo from "../repositories/subscription_repository.js";
import * as channelRepo from "../repositories/channel_repository.js";
import { AppError } from "../errors/app_error.js";

export const subscribe = async (channelId, userId) => {
  const channel = await channelRepo.getChannelById(channelId);

  if (!channel) {
    throw new AppError("Channel not found", 404);
  }

  if (channel.owner === userId) {
    throw new AppError("Cannot subscribe to your own channel", 400);
  }

  const created = await subRepo.createSubscription(channelId, userId);

  // idempotent behavior
  if (!created) {
    return { subscribed: true };
  }

  return created;
};

export const unsubscribe = async (channelId, userId) => {
  await subRepo.deleteSubscription(channelId, userId);
};

export const getMySubscriptions = async (userId) => {
  return subRepo.getSubscriptionsByUser(userId);
};

export const getChannelSubscribers = async (channelId) => {
  return subRepo.getSubscribersByChannel(channelId);
};
