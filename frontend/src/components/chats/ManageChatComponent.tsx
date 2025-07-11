const ManageChatComponent = ({
  setActiveTab,
  loggedUserId,
  friendRequests,
}) => {
  return (
    <div className="rounded-xl">
      <div className="h-[10%]">
        <div className="flex text-xl h-[80%] p-0 rounded-[2rem 2rem 0 0]">
          <h1
            className="m-0 text-center p-2 text-2xl"
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </h1>
          {friendRequests.length > 0 && (
            <h1 onClick={() => setActiveTab("friendRequest")}>
              Friend Requests
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
export default ManageChatComponent;
