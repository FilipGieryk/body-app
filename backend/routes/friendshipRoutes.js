const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const friendshipController = require("../controllers/friendshipController");

const router = express.Router();

router.post("/send-request", friendshipController.sendRequest);
router.post(
  "/accept-request",
  authenticateToken,
  friendshipController.acceptRequest
);
router.post(
  "/decline-request",
  authenticateToken,
  friendshipController.declineRequest
);
router.delete("/remove-friend", friendshipController.removeFriend);
router.get("/:userId/friends", friendshipController.getFriends);
router.get(
  "/pending-requests",
  authenticateToken,
  friendshipController.getPendingRequests
);

module.exports = router;
