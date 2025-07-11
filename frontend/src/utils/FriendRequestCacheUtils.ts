import { QueryClient } from "@tanstack/react-query";

export const updateFriendRequests = (queryClient, newRequest) => {
  queryClient.setQueryData(["friendRequests"], (oldRequests) => {
    return [...oldRequests, newRequest];
  });
};
