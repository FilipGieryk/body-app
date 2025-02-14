import React from "react";
import { useFriendRequests } from "../../context/FriendRequestsContext";

export const FriendRequest: React.FC = () => {
  const {
    friendRequests,
    isLoading,
    isError,
    error,
    acceptRequest,
    declineRequest,
  } = useFriendRequests();
  if (isLoading) {
    return <div>Loading friend requests...</div>;
  }

  if (isError) {
    return <div>Error loading friend requests: {error?.message}</div>;
  }

  return (
    <div>
      {friendRequests.map((request) => (
        <div className="flex items-center decoration-0 h-32 w-full gap-4">
          <img
            className="h-28 rounded-4xl"
            src={request.user.profilePhoto}
          ></img>
          <div className="text-xl">
            <h2 className="m-0">{request.user.username}</h2>
          </div>
          <button onClick={() => acceptRequest(request.user)}>+</button>
          <button onClick={() => declineRequest(request.user._id)}>-</button>
        </div>
      ))}
    </div>
  );
};
