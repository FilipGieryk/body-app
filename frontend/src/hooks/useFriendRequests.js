// import { useEffect, useState } from "react";
// import axios from "axios";

// const useFriendRequests = (userId, userInfo) => {
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [requestStatus, setRequestStatus] = useState("none");

//   const fetchPendingRequests = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/api/friendships/pending-requests", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const requests = response.data;
//       setFriendRequests(requests);

//       if (userInfo.friends?.includes(userInfo._id)) {
//         setRequestStatus("friends");
//       } else if (
//         requests.some(
//           (req) => req.friend._id === userInfo._id && req.user._id === userId
//         )
//       ) {
//         setRequestStatus("sent");
//       } else if (
//         requests.some(
//           (req) => req.user._id === userInfo._id && req.friend._id === userId
//         )
//       ) {
//         setRequestStatus("received");
//       } else {
//         setRequestStatus("none");
//       }
//     } catch (err) {
//       console.error("Error fetching pending requests:", err);
//     }
//   };

//   const handleAcceptRequest = async (friendId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/api/friendships/accept-request",
//         { friendId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRequestStatus("friends");
//       setFriendRequests((prev) =>
//         prev.filter((req) => req.user._id !== friendId)
//       );
//     } catch (error) {
//       console.error("Failed to accept friend request", error);
//     }
//   };

//   const handleDeclineRequest = async (friendId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/api/friendships/decline-request",
//         { friendId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFriendRequests((prev) =>
//         prev.filter((req) => req.user._id !== friendId)
//       );
//       setRequestStatus("none");
//     } catch (error) {
//       console.error("Failed to decline friend request", error);
//     }
//   };

//   useEffect(() => {
//     fetchPendingRequests();
//   }, [userId, userInfo]);

//   return {
//     friendRequests,
//     requestStatus,
//     handleAcceptRequest,
//     handleDeclineRequest,
//   };
// };

// export default useFriendRequests;
