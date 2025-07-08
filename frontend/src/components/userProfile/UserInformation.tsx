import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useFriendRequests } from "../../context/FriendRequestsContext";
import { useUpdateUser } from "../../hooks/fetch/useUpdateUser";
import { useLoggedUserInfo } from "../../hooks/fetch/useLoggedUserInfo.ts";
const UserInformation = ({ userInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: loggedUserInfo } = useLoggedUserInfo();

  const navigate = useNavigate();
  const {
    sendRequest,
    removeFriend,
    friendRequests,
    getFriendshipStatus,
    acceptRequest,
    declineRequest,
  } = useFriendRequests();
  const { mutate: updateUser, isPending, isError, error } = useUpdateUser();

  const handleUpdate = (updatedFields) => {
    updateUser({ updatedFields });
  };

  const requestStatus = getFriendshipStatus(userInfo._id, loggedUserInfo);

  return (
    <div className="flex rounded-2xl flex-col justify-start items-center px-8 row-start-1 row-end-3 bg-amber-200 shadow-xl">
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
            onClick={() => handleUpdate(userInfo.username)}
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
                  <button onClick={() => removeFriend(userInfo._id)}>
                    Delete friend
                  </button>
                </>
              ) : requestStatus === "received" ? (
                <>
                  <p>Request Received</p>
                  <button onClick={() => acceptRequest(userInfo._id)}>
                    Accept
                  </button>
                  <button onClick={() => declineRequest(userInfo._id)}>
                    Decline
                  </button>
                </>
              ) : requestStatus === "sent" ? (
                <p>Request Sent</p>
              ) : (
                <button onClick={() => sendRequest(userInfo?._id)}>
                  Add Friend
                </button>
              )}
              <button>Message</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInformation;
