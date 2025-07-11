import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addUserPhoto,
  deleteUserPhoto,
} from "../features/profile/api/usersService";
import { useState } from "react";

export const useUserPhotos = () => {
  const queryClient = useQueryClient();
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const addPhotoMutation = useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });
      await addUserPhoto(formData);
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
    const files = Array.from(event.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedPhotos(previewUrls);
    if (files.length > 0) {
      addPhotoMutation.mutate(files);
    }
  };

  const handleDeletePhotos = (photo) => {
    deletePhotoMutation.mutate(photo);
  };

  return {
    handleFileChangeAndAdd,
    handleDeletePhotos,
    addPhotoStatus: addPhotoMutation,
    deletePhotoStatus: deletePhotoMutation,
    selectedPhotos,
  };
};
