import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserPhoto, deleteUserPhoto } from "../api/usersService";
import { useState } from "react";

export const useUserPhotos = () => {
  const queryClient = useQueryClient();
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const addPhotoMutation = useMutation({
    mutationFn: async (updatedPhotos) => {
      await addUserPhoto(updatedPhotos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userPhotos"]);
      setSelectedPhotos([]);
    },
    onError: (error) => {
      console.error("Error adding photo:", error);
    },
  });
  const deletePhotoMutation = useMutation({
    mutationFn: async (updatedPhotos) => {
      await deleteUserPhoto(updatedPhotos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userPhotos"]);
    },
    onError: (error) => {
      console.error("Error deleting photo:", error);
    },
  });

  const handleFileChangeAndAdd = (event) => {
    const files = Array.from(event.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedPhotos(files);
    if (files.length > 0) {
      addPhotoMutation.mutate(files);
    }
  };

  const handleDeletePhotos = (photo) => {
    deletePhotoMutation.mutate([photo]);
  };

  return {
    handleFileChangeAndAdd,
    handleDeletePhotos,
    addPhotoStatus: addPhotoMutation,
    deletePhotoStatus: deletePhotoMutation,
    selectedPhotos,
  };
};
