import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../hooks/UserContext";
const UserInformation = ({ userInfo, setUserInfo, socket, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const {
    loggedUserInfo,
    handleAcceptRequest,
    handleDeclineRequest,
    friendRequests,
  } = useUser();

  useEffect(() => {
    if (loggedUserInfo?.friends?.some((el) => el._id === userInfo._id)) {
      setRequestStatus("friends");
    } else if (
      friendRequests.some(
        (req) =>
          req.friend._id === userInfo._id && req.user._id === loggedUserInfo._id
      )
    ) {
      setRequestStatus("sent");
    } else if (
      friendRequests.some(
        (req) => req.user._id === userInfo._id && req.friend._id === userId
      )
    ) {
      setRequestStatus("received");
    } else {
      setRequestStatus("none");
    }
  }, [friendRequests]);
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
          userId: loggedUserInfo._id,
          friendId: userInfo._id,
        },
      });
      setRequestStatus("none");
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        friends: prevUserInfo.friends.filter((friend) => friend !== userId),
      }));
    } catch (error) {
      console.error("failed to delete user", error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      const response = await axios.post("/api/friendships/send-request", {
        userId: loggedUserInfo._id,
        friendId: userInfo._id,
      });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(response.data));
      }

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
          <p>{userInfo?.username}</p>
          {loggedUserInfo?._id === userInfo?._id ? (
            <button
              className="edit-user-button"
              onClick={() => setIsEditing(true)}
            ></button>
          ) : (
            <>
              {requestStatus === "friends" ? (
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
