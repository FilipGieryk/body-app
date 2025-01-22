const ratingService = require("../services/ratingService");

class RatingController {
  async addOrUpdateRating(req, res) {
    const { userId, rating, contentType } = req.body;
    const { contentId } = req.params;

    try {
      const response = await ratingService.addOrUpdateRating(
        userId,
        contentId,
        rating,
        contentType
      );
      res.status(200).json(response);
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({ message: err.message });
      } else if (
        err.message === "Rating must be between 1 and 5" ||
        err.message === "Invalid content type"
      ) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RatingController();
