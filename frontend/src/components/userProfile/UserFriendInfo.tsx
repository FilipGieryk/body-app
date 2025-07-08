import { useFriendRequests } from "../../context/FriendRequestsContext";

export const UserFriendInfo = () => {
  const {
    sendRequest,
    removeFriend,
    friendRequests,
    getFriendshipStatus,
    acceptRequest,
    declineRequest,
  } = useFriendRequests();
  return (
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
          <button onClick={() => acceptRequest(userInfo._id)}>Accept</button>
          <button onClick={() => declineRequest(userInfo._id)}>Decline</button>
        </>
      ) : requestStatus === "sent" ? (
        <p>Request Sent</p>
      ) : (
        <button onClick={() => sendRequest(userInfo?._id)}>Add Friend</button>
      )}
      <button>Message</button>
    </>
  );
};
