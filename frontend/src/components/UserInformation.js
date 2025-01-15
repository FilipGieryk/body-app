import { useEffect, useState } from "react";
import axios from "axios";

const UserInformation = ({ userInfo, setUserInfo, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/users/${userInfo._id}`,
        {
          username: userInfo.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(response.data);
      alert("User info updated successfully");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating user info", error);
    }
  };
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token-based authentication
        const response = await axios.get(
          `/api/friendships/${userId}/pending-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const requests = response.data;
        setPendingRequests(requests); // Set pending requests in state
        console.log(pendingRequests);

        // Check if the logged-in user is friends with the user being viewed
        if (userInfo.friends?.includes(userInfo._id)) {
          setRequestStatus("friends");
        } else if (
          requests.some(
            (req) => req.friend._id === userInfo._id && req.user._id === userId // Received request
          )
        ) {
          setRequestStatus("sent"); // Indicates received request
        } else if (
          requests.some(
            (req) => req.user._id === userInfo._id && req.friend._id === userId // Sent request
          )
        ) {
          setRequestStatus("received"); // Indicates sent request
        } else {
          setRequestStatus("none");
        }
      } catch (err) {
        console.error("Error fetching pending requests:", err);
      }
    };
    fetchPendingRequests();
  }, [userId, userInfo]);

  const handleAcceptRequest = async () => {
    try {
      await axios.post("/api/friendships/accept-request", {
        userId,
        friendId: userInfo._id,
      });
      setRequestStatus("friends");
      setUserInfo((prev) => ({
        ...prev,
        friends: [...prev.friends, userId], // Add the userId to the friends list
      }));
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await axios.post("/api/friendships/decline-request", {
        userId: userInfo._id,
        friendId: userId,
      });
      setRequestStatus("none");
    } catch (error) {
      console.error("Failed to decline friend request", error);
    }
  };
  const handleDeleteFriend = async () => {
    try {
      await axios.delete("/api/friendships/remove-friend", {
        data: {
          userId: userId,
          friendId: userInfo._id,
        },
      });
      setRequestStatus("none");
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        friends: prevUserInfo.friends.filter((friend) => friend !== userId),
      }));
      console.log(userInfo);
    } catch (error) {
      console.error("failed to delete user", error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      const response = await axios.post("/api/friendships/send-request", {
        userId, // Current user's ID
        friendId: userInfo._id, // Profile owner's ID
      });

      setRequestStatus("sent");
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  return (
    <div className="profile-grid-item about">
      {isEditing ? (
        <div className="profile-grid-inner display-column">
          <div className="profile-edit-container">
            <img
              src={userInfo.profilePhoto}
              className="profile-pic profile-edit-photo"
            ></img>
            <p className="profile-edit-photo-text">+</p>
          </div>
          <input
            className="profile-edit-text"
            type="text"
            value={userInfo.username}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <button onClick={handleSaveChanges} className="edit-user-button">
            Save
          </button>
        </div>
      ) : (
        <div className="profile-grid-inner display-column">
          <img src={userInfo.profilePhoto} className="profile-pic"></img>
          <p>{userInfo.username}</p>
          {userId === userInfo._id ? (
            <button
              className="edit-user-button"
              onClick={() => setIsEditing(true)}
            ></button>
          ) : (
            <>
              {userInfo.friends.some((friend) => friend === userId) ? (
                <>
                  <p>Friends</p>
                  <button onClick={handleDeleteFriend}>Delete friend</button>
                </>
              ) : requestStatus === "received" ? (
                <>
                  <p>Request Received</p>
                  <button onClick={handleAcceptRequest}>Accept</button>
                  <button onClick={handleDeclineRequest}>Decline</button>
                </>
              ) : requestStatus === "sent" ? (
                <p>Request Sent</p>
              ) : (
                <button onClick={handleSendFriendRequest}>Add Friend</button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInformation;
