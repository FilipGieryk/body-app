import { useFriendRequests } from "../../../context/FriendRequestsContext";

type UserFriendInfoProps = {
  userId: string;
  loggedUserInfo: string;
};

export const UserFriendInfo = ({
  userId,
  loggedUserInfo,
}: UserFriendInfoProps) => {
  const {
    sendRequest,
    removeFriend,
    getFriendshipStatus,
    acceptRequest,
    declineRequest,
  } = useFriendRequests();

  const requestStatus = getFriendshipStatus(userId, loggedUserInfo);
  console.log(requestStatus);
  return (
    <>
      {requestStatus === "friends" ? (
        <>
          <p>Friends</p>
          <button onClick={() => removeFriend(userId)}>Delete friend</button>
        </>
      ) : requestStatus === "received" ? (
        <>
          <p>Request Received</p>
          <button onClick={() => acceptRequest(userId)}>Accept</button>
          <button onClick={() => declineRequest(userId)}>Decline</button>
        </>
      ) : requestStatus === "sent" ? (
        <p>Request Sent</p>
      ) : (
        <button onClick={() => sendRequest(userId)}>Add Friend</button>
      )}
      <button>Message</button>
    </>
  );
};
