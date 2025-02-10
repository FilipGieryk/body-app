import axios from "axios";

// export interface Friendship{
//   userId:
// }

// export const deleteFriendship = async () => {
//   try {
//     await axios.delete("/api/friendships/remove-friend", {
//       data: {
//         userId: loggedUserInfo._id,
//         friendId: userInfo._id,
//       },
//     });
//     setRequestStatus("none");
//     setUserInfo((prevUserInfo) => ({
//       ...prevUserInfo,
//       friends: prevUserInfo.friends.filter((friend) => friend !== userId),
//     }));
//   } catch (error) {
//     console.error("failed to delete user", error);
//   }
// };

// export const sendFriendshipRequest = async () => {
//   try {
//     const response = await axios.post("/api/friendships/send-request", {
//       userId: loggedUserInfo._id,
//       friendId: userInfo._id,
//     });
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(response.data));
//     }

//     setRequestStatus("sent");
//   } catch (error) {
//     console.error("Failed to send friend request", error);
//   }
// };
