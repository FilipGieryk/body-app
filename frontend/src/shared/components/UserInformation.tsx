import { useState } from "react";

const UserInformation = ({
  username,
  profilePhoto,
  isLoggedUser = false,
  orientation = "column",
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`flex rounded-2xl justify-start items-center px-8 ${
        orientation === "row" ? "flex-row" : "flex-col"
      }`}
    >
      {isEditing ? (
        <>{/* // <EditUserInfo initialUserInfo={userInfo} /> */}</>
      ) : (
        <div
          className={`flex relative text-4xl justify-start items-center ${
            orientation === "row" ? "flex-row" : "flex-col"
          }`}
        >
          <img
            src={profilePhoto}
            className="mt-20 w-60 rounded-[50%] transition-all"
            loading="lazy"
          />
          <p>{username}</p>
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
