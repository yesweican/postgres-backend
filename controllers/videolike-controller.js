import * as videoLikeService from "../services/videolike_service.js";

export const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const viewerId = req.user.id;

    const result = await videoLikeService.toggle(videoId, viewerId);

    res.json({
      liked: result.liked
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

export const checkVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const viewerId = req.user.id;

    const liked = await videoLikeService.check(videoId, viewerId);

    res.json({ liked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check like" });
  }
};

export const countVideoLikes = async (req, res) => {
  try {
    const { videoId } = req.params;

    const count = await videoLikeService.count(videoId);

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count likes" });
  }
};