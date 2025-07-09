import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useFriendRequests } from "../../context/FriendRequestsContext";
import { useUpdateUser } from "../../hooks/fetch/useUpdateUser";
import { useLoggedUserInfo } from "../../hooks/fetch/useLoggedUserInfo.ts";
import { EditUserInfo } from "./EditUserInfo.tsx";
const UserInformation = ({ userInfo, isLoggedUser = false }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex rounded-2xl flex-col justify-start items-center px-8">
      {isEditing ? (
        <EditUserInfo initialUserInfo={userInfo} />
      ) : (
        <div className="flex relative text-4xl justify-start items-center flex-col">
          <img
            src={userInfo.profilePhoto}
            className="mt-20 w-60 rounded-[50%] transition-all"
          ></img>
          <p>{userInfo?.username}</p>
          {isLoggedUser && (
            <button
              className="absolute top-0 -right-60 w-20 h-20 rounded-[50%] border-0"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInformation;
