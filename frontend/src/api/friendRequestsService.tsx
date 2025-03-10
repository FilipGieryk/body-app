import axios from "axios";

const URL = "api/friendships";
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export interface FriendRequest {
  id: string;
  status: string;
  user: any;
  friend: any;
  createdAt: Date;
}

export const fetchFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    console.log("sd");
    const response = await axios.get(`/${URL}/pending-requests`, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching friend requests"
    );
  }
};

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
  try {
    await axios.post(`${URL}/accept-request`, { friendId }, { headers });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error accepting friend request"
    );
  }
};

export const declineFriendRequest = async (friendId: string): Promise<void> => {
  try {
    await axios.post(`${URL}/decline-request`, { friendId }, { headers });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error declining friend request"
    );
  }
};

export const sendFriendRequest = async (friendId: string) => {
  try {
    await axios.post(`${URL}/send-request`, { friendId }, { headers });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error sending friend request"
    );
  }
};

export const deleteFriendship = async (friendId: string) => {
  try {
    await axios.delete(
      "/api/friendships/remove-friend",
      { friendId },
      { headers }
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting friend");
  }
};
