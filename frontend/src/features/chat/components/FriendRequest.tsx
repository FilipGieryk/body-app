export const FriendRequest = ({
  friendRequests,
  acceptRequest,
  declineRequest,
}) => {
  console.log(friendRequests);
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
