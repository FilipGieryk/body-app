const friendshipService = require("../services/friendshipService");
const User = require("../models/User");
const { broadcast } = require("../websocket");

exports.sendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const result = await friendshipService.createFriendRequest(
      userId,
      friendId
    );

    broadcast({
      type: "friend-request",
      userId,
      friendId,
    });
    return res.status(201).json({ message: "Friend request sent", result });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Error sending friend request" });
  }
};

exports.acceptRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    await friendshipService.acceptFriendRequest(userId, friendId);
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ message: "Error accepting friend request" });
  }
};

exports.declineRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    await friendshipService.declineFriendRequest(userId, friendId);
    return res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    return res.status(500).json({ message: "Error declining friend request" });
  }
};

exports.removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    await friendshipService.removeFriend(userId, friendId);
    return res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error);
    return res.status(500).json({ message: "Error removing friend" });
  }
};

exports.getFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await friendshipService.getFriends(userId);
    return res.status(200).json(friends);
  } catch (error) {
    console.error("Error retrieving friends:", error);
    return res.status(500).json({ message: "Error retrieving friends" });
  }
};

exports.getPendingRequests = async (req, res) => {
  const userId = req.user._id;

  try {
    const pendingRequests = await friendshipService.getPendingRequests(userId);
    return res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error retrieving pending requests:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving pending requests" });
  }
};
