import api from "../api/axios";

const URL = "/friendships";

export interface FriendRequest {
  id: string;
  status: string;
  user: any;
  friend: any;
  createdAt: Date;
}

export const fetchFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const response = await api.get(`${URL}/pending-requests`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching friend requests"
    );
  }
};

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
  try {
    await api.post(`${URL}/accept-request`, { friendId });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error accepting friend request"
    );
  }
};

export const declineFriendRequest = async (friendId: string): Promise<void> => {
  try {
    await api.post(`${URL}/decline-request`, { friendId });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error declining friend request"
    );
  }
};

export const sendFriendRequest = async (friendId: string) => {
  try {
    await api.post(`${URL}/send-request`, { friendId });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error sending friend request"
    );
  }
};

export const deleteFriendship = async (friendId: string) => {
  try {
    await api.delete("/friendships/remove-friend", {
      data: { friendId },
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting friend");
  }
};
