import * as commentsService from "../services/comment_service.js";

export async function createComment(req, res, next) {
  try {
    const { video_id, comment_replyto, comment_details } = req.body;
    const creator = req.user.id;

    const comment = await commentsService.createComment({
      video_id,
      comment_replyto,
      comment_details,
      creator
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

//==============comment_controller=================

export async function getCommentsByVideo(req, res, next) {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new AppError("Video ID is required", 400);
    }

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const { total, rows } =
      await commentsService.getCommentsByVideo(
        videoId,
        { page, pageSize }
      );

    res.status(200).json({
      page,
      pageSize,
      total,
      count: rows.length,
      results: rows
    });

  } catch (err) {
    next(err);
  }
}

export async function updateComment(req, res, next) {
  try {
    const { id } = req.params;
    const { comment_details } = req.body;
    const userId = req.user.id;

    await commentsService.updateComment(id, userId, comment_details);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await commentsService.softDeleteComment(id, userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
