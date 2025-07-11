const friendshipService = require("../services/friendshipService");
const { sendToUser } = require("../websocket");
const User = require("../models/User");
class FriendshipController {
  async sendRequest(req, res) {
    const userId = req.user._id;
    const { friendId } = req.body;
    try {
      const result = await friendshipService.createFriendRequest(
        userId,
        friendId
      );
      const user = await User.findById(userId);
      sendToUser(friendId, {
        type: "friend-request",
        userId: userId,
        friendId: friendId,
        username: user.username,
        profilePhoto: user.profilePhoto,
      });
      return res.status(201).json({ message: "Friend request sent", result });
    } catch (error) {
      console.error("Error sending friend request:", error);
      return res.status(500).json({ message: "Error sending friend request" });
    }
  }

  async acceptRequest(req, res) {
    const { friendId } = req.body;
    const userId = req.user._id;

    try {
      await friendshipService.acceptFriendRequest(userId, friendId);
      return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      return res
        .status(500)
        .json({ message: "Error accepting friend request" });
    }
  }

  async declineRequest(req, res) {
    const { friendId } = req.body;
    const userId = req.user._id;

    try {
      await friendshipService.declineFriendRequest(userId, friendId);
      return res.status(200).json({ message: "Friend request declined" });
    } catch (error) {
      console.error("Error declining friend request:", error);
      return res
        .status(500)
        .json({ message: "Error declining friend request" });
    }
  }

  async removeFriend(req, res) {
    const { friendId } = req.body;
    const userId = req.user._id;
    try {
      await friendshipService.removeFriend(userId, friendId);
      return res.status(200).json({ message: "Friend removed" });
    } catch (error) {
      console.error("Error removing friend:", error);
      return res.status(500).json({ message: "Error removing friend" });
    }
  }

  async getFriends(req, res) {
    const { userId } = req.params;

    try {
      const friends = await friendshipService.getFriends(userId);
      return res.status(200).json(friends);
    } catch (error) {
      console.error("Error retrieving friends:", error);
      return res.status(500).json({ message: "Error retrieving friends" });
    }
  }

  async getPendingRequests(req, res) {
    const userId = req.user._id;
    try {
      const pendingRequests = await friendshipService.getPendingRequests(
        userId
      );
      return res.status(200).json(pendingRequests);
    } catch (error) {
      console.error("Error retrieving pending requests:", error);
      return res
        .status(500)
        .json({ message: "Error retrieving pending requests" });
    }
  }
}

// Export an instance of the FriendshipController class
module.exports = new FriendshipController();
