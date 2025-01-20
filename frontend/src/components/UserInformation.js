import { useEffect, useState } from "react";
import axios from "axios";

const UserInformation = ({
  userInfo,
  setUserInfo,
  userId,
  requestStatus,
  setRequestStatus,
  handleAcceptRequest,
  handleDeclineRequest,
}) => {
  const [isEditing, setIsEditing] = useState(false);

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
