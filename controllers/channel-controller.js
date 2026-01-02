import * as channelService from "../services/channel_service.js";

export const createChannel = async (req, res, next) => {
  try {
    const channel = await channelService.createChannel({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id
    });

    res.status(201).json(channel);
  } catch (err) {
    next(err);
  }
};

export const getChannelById = async (req, res, next) => {
  try {
    const channel = await channelService.getChannelById(req.params.id);
    res.json(channel);
  } catch (err) {
    next(err);
  }
};

export const getMyChannels = async (req, res, next) => {
  const userid = req.user.id;
  try {
    const channels = await channelService.getMyChannels(userid);
    res.json(channels);
  } catch (err) {
    next(err);
  }
};

export const updateChannel = async (req, res, next) => {
  try {
    const channel = await channelService.updateChannel(
      req.params.id,
      req.user.id,
      {
        name: req.body.name,
        description: req.body.description
      }
    );

    res.json(channel);
  } catch (err) {
    next(err);
  }
};

export const deleteChannel = async (req, res, next) => {
  try {
    await channelService.deleteChannel(req.params.id, req.user.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
