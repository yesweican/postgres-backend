import * as subscriptionService from "../services/subscription_service.js";

export const subscribe = async (req, res, next) => {
  try {
    const result = await subscriptionService.subscribe(
      req.params.channelId,
      req.user.id
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await subscriptionService.unsubscribe(
      req.params.channelId,
      req.user.id
    );

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

/**
 * Channels the current user is subscribed to
 */
export const getMySubscriptions = async (req, res, next) => {
  try {
    const subs = await subscriptionService.getMySubscriptions(req.user.id);
    res.json(subs);
  } catch (err) {
    next(err);
  }
};

/**
 * Users subscribed to a channel
 */
export const getChannelSubscribers = async (req, res, next) => {
  try {
    const subscribers = await subscriptionService.getChannelSubscribers(
      req.params.channelId
    );

    res.json(subscribers);
  } catch (err) {
    next(err);
  }
};
