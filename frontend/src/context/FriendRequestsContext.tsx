import { createContext, useContext } from "react";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  FriendRequest,
  sendFriendRequest,
  deleteFriendship,
} from "../api/friendRequestsService.tsx";

interface FriendRequestsContextType {
  friendRequests: FriendRequest[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  acceptRequest: (friendId: string) => void;
  declineRequest: (friendId: string) => void;
  sendRequest: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  getFriendshipStatus: (userId: string, loggedUserInfo: any) => string;
}

const FriendRequestsContext = createContext<
  FriendRequestsContextType | undefined
>(undefined);

export const FriendRequestsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    data: friendRequests = [],
    isLoading,
    isError,
    error,
  } = useQuery<FriendRequest[], Error>({
    queryKey: ["friendRequests"],
    queryFn: fetchFriendRequests,
  });
  const queryClient = useQueryClient();

  const mutationAccept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const mutationDecline = useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const mutationSendRequest = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const mutationDeleteFriend = useMutation({
    mutationFn: deleteFriendship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const acceptRequest = (friendId: string) => {
    mutationAccept.mutate(friendId);
  };

  const declineRequest = (friendId: string) => {
    mutationDecline.mutate(friendId);
  };

  const sendRequest = (friendId: string) => {
    mutationSendRequest.mutate(friendId);
  };
  const removeFriend = (friendId: string) => {
    mutationDeleteFriend.mutate(friendId);
  };

  const getFriendshipStatus = (userId: string, loggedUserInfo: any) => {
    if (!loggedUserInfo) return "none";

    if (
      loggedUserInfo.friends?.some((el: { _id: string }) => el._id === userId)
    ) {
      return "friends";
    } else if (
      friendRequests.some(
        (req) =>
          req.friend._id === userId && req.user._id === loggedUserInfo._id
      )
    ) {
      return "sent";
    } else if (
      friendRequests.some(
        (req) =>
          req.user._id === userId && req.friend._id === loggedUserInfo._id
      )
    ) {
      return "received";
    } else {
      return "none";
    }
  };

  return (
    <FriendRequestsContext.Provider
      value={{
        friendRequests,
        isLoading,
        isError,
        error,
        acceptRequest,
        declineRequest,
        sendRequest,
        removeFriend,
        getFriendshipStatus,
      }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
};

export const useFriendRequests = (): FriendRequestsContextType => {
  const context = useContext(FriendRequestsContext);
  if (!context) {
    throw new Error(
      "useFriendRequests must be used within a FriendRequestsProvider"
    );
  }
  return context;
};
