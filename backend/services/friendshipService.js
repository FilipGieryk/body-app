const Friendship = require("../models/Friendship");
const User = require("../models/User");

class FriendshipService {
  async createFriendRequest(userId, friendId) {
    const newFriendship = new Friendship({
      user: userId,
      friend: friendId,
      status: "pending",
    });

    await newFriendship.save();
    return newFriendship;
  }

  async acceptFriendRequest(userId, friendId) {
    const friendship = await Friendship.findOneAndUpdate(
      { user: friendId, friend: userId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!friendship) {
      throw new Error("Friend request not found");
    }

    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } });
  }

  async declineFriendRequest(userId, friendId) {
    const friendship = await Friendship.findOneAndDelete({
      user: friendId,
      friend: userId,
      status: "pending",
    });

    if (!friendship) {
      throw new Error("Friend request not found");
    }
  }

  async removeFriend(userId, friendId) {
    await Friendship.findOneAndDelete({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
  }

  async getFriends(userId) {
    return await Friendship.find({
      user: userId,
      status: "accepted",
    }).populate("friend", "username profilePhoto");
  }

  async getPendingRequests(userId) {
    return await Friendship.find({
      $or: [{ user: userId }, { friend: userId }],
      status: "pending",
    }).populate("user friend");
  }
}

// Export an instance of the FriendshipService class
module.exports = new FriendshipService();
