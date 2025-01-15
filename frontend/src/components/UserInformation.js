import { useEffect, useState } from "react";
import axios from "axios";

const UserInformation = ({ userInfo, setUserInfo, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

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
    if (userInfo.friends?.includes(userId)) {
      setRequestStatus("friends");
    } else if (userInfo.pendingRequests?.some((req) => req.sender === userId)) {
      setRequestStatus("pending");
    } else {
      setRequestStatus("none");
    }
  }, []);

  const handleAcceptRequest = async () => {
    try {
      await axios.post("/api/friendship/accept-request", {
        userId,
        friendId: userInfo._id,
      });
      setRequestStatus("friends");
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await axios.post("/api/friendship/decline-request", {
        userId,
        friendId: userInfo._id,
      });
      setRequestStatus("none");
    } catch (error) {
      console.error("Failed to decline friend request", error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      const response = await axios.post("/api/friendships/send-request", {
        userId, // Current user's ID
        friendId: userInfo._id, // Profile owner's ID
      });
      setRequestStatus("pending");
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };
  console.log(isEditing);

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
              {requestStatus === "friends" ? (
                <p>Friends</p>
              ) : requestStatus === "pending" ? (
                <p>Request Sent</p>
              ) : userInfo.pendingRequests?.some(
                  (req) => req.sender === userId
                ) ? (
                <>
                  <button onClick={handleAcceptRequest}>Accept</button>
                  <button onClick={handleDeclineRequest}>Decline</button>
                </>
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
