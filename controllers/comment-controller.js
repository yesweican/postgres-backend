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

export async function getCommentsByVideo(req, res, next) {
  try {
    const { videoId } = req.params;
    const results= await commentsService.getCommentsByVideo(videoId);
    res.status(200).json({
    count: results.length, 
    results });
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
