import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";
const UserInformation = ({ userInfo, setUserInfo, socket, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const {
    loggedUserInfo,
    handleAcceptRequest,
    handleDeclineRequest,
    friendRequests,
  } = useUser();
  const navigate = useNavigate();

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

  const createOrGetMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/chat/create-or-get",
        {
          recipientId: userInfo._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/chat/${response.data.chatId}`);
    } catch (error) {
      console.error("error creating chat", error);
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
    <div className="flex rounded-2xl flex-col justify-start items-center px-8 row-start-1 row-end-3">
      {isEditing ? (
        <div className="flex relative text-4xl justify-start items-center flex-col">
          <div className="flex justify-center relative">
            <img
              src={userInfo.profilePhoto}
              className="mt-20 w-60 rounded-[50%] transition-all profile-edit-photo"
            ></img>
            <p className="absolute top-0 translate-y-[50%] invisible text-4xl transition-all opacity-0">
              +
            </p>
          </div>
          <input
            className="w-20 h-8 border-2 mx-8"
            type="text"
            value={userInfo.username}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <input placeholder="yt"></input>
          <input placeholder="insta"></input>
          <input placeholder="x"></input>
          <button
            onClick={handleSaveChanges}
            className="absolute top-0 -right-60 w-20 h-20 rounded-[50%] border-0"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex relative text-4xl justify-start items-center flex-col">
          <img
            src={userInfo.profilePhoto}
            className="mt-20 w-60 rounded-[50%] transition-all"
          ></img>
          <p>{userInfo?.username}</p>
          {loggedUserInfo?._id === userInfo?._id ? (
            <button
              className="absolute top-0 -right-60 w-20 h-20 rounded-[50%] border-0"
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
              <button onClick={createOrGetMessage}>Message</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInformation;
