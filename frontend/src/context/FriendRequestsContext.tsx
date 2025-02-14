import { createContext, useContext } from "react";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  FriendRequest,
} from "../api/friendRequestsService.tsx";

interface FriendRequestsContextType {
  friendRequests: FriendRequest[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  acceptRequest: (friendId: string) => void;
  declineRequest: (friendId: string) => void;
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

  const acceptRequest = (friendId: string) => {
    mutationAccept.mutate(friendId);
  };

  const declineRequest = (friendId: string) => {
    mutationDecline.mutate(friendId);
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
