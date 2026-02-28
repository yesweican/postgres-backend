import * as channelService from "../services/channel_service.js";
import { AppError } from "../errors/app_error.js";

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
  try {
    const userid = req.user.id;

    if (!userid) {
      throw new AppError("User ID is required", 400);
    }

    const results = await channelService.getMyChannels(userid);
    console.log("My Channels:", results);
    res.status(200).json({
      count: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
};

export const getChannelSubscribers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      throw new AppError("Channel ID is required", 400);
    }

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const { total, rows } =
      await channelService.getChannelSubscribers({
        channelId: id,
        userId,
        page,
        pageSize
      });

    res.status(200).json({
      channelId: id,
      page,
      pageSize,
      total,
      count: rows.length,
      results: rows
    });

  } catch (err) {
    console.error(err);
  }
};

export const getChannelVideos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Channel ID is required", 400);
    }

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const { total, rows } =
      await channelService.getChannelVideos({
        channelId: id,
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
    console.error(err);
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
