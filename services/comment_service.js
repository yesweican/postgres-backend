import * as commentsRepo from "../repositories/comment_repository.js";
import { v4 as uuidv4 } from "uuid";

export async function createComment(data) {
  const comment = {
    id: uuidv4(),
    video_id: data.video_id,
    comment_replyto: data.comment_replyto ?? null,
    comment_details: data.comment_details,
    creator: data.creator
  };

  return commentsRepo.insertComment(comment);
}

export async function getCommentsByVideo(videoId) {
  // returns flat list; frontend or helper can build tree
  return commentsRepo.findByVideoId(videoId);
}

export async function updateComment(commentId, userId, commentDetails) {
  const existing = await commentsRepo.findById(commentId);

  if (!existing || existing.deleted) {
    throw new Error("Comment not found");
  }

  if (existing.creator !== userId) {
    throw new Error("Unauthorized");
  }

  await commentsRepo.updateComment(commentId, commentDetails);
}

export async function softDeleteComment(commentId, userId) {
  const existing = await commentsRepo.findById(commentId);

  if (!existing || existing.deleted) {
    throw new Error("Comment not found");
  }

  if (existing.creator !== userId) {
    throw new Error("Unauthorized");
  }

  await commentsRepo.softDelete(commentId);
}
