const express = require("express");
const router = express.Router();
const Friendship = require("../models/Friendship");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

// Send Friend Request
router.post("/send-request", async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const newFriendship = new Friendship({
      user: userId,
      friend: friendId,
      status: "pending",
    });
    await newFriendship.save();
    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request" });
  }
});
router.post("/accept-request", async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const friendship = await Friendship.findOneAndUpdate(
      { user: friendId, friend: userId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
});
router.post("/reject-request", async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const friendship = await Friendship.findOneAndDelete({
      user: friendId,
      friend: userId,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
});
router.delete("/remove-friend", async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    await Friendship.findOneAndDelete({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend" });
  }
});
router.get("/:userId/friends", async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await Friendship.find({
      user: userId,
      status: "accepted",
    }).populate("friend");

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error retrieving friends:", error);
    res.status(500).json({ message: "Error retrieving friends" });
  }
});
router.get("/:userId/pending-requests", async (req, res) => {
  const { userId } = req.params;

  try {
    const pendingRequests = await Friendship.find({
      friend: userId,
      status: "pending",
    }).populate("user");

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error retrieving pending requests:", error);
    res.status(500).json({ message: "Error retrieving pending requests" });
  }
});
module.exports = router;