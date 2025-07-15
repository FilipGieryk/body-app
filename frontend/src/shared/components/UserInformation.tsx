import { useState } from "react";

const UserInformation = ({
  username,
  profilePhoto,
  isLoggedUser = false,
  orientation = "column",
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <>{/* // <EditUserInfo initialUserInfo={userInfo} /> */}</>
      ) : (
        <div
          className={`flex relative h-full text-4xl justify-start items-center ${
            orientation === "row" ? "flex-row" : "flex-col"
          }`}
        >
          <img
            src={profilePhoto}
            className={`mt-2 rounded-[50%] object-cover transition-all ${
              orientation === "row" ? "h-full" : "w-1/2"
            }`}
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
    </>
  );
};

export default UserInformation;
