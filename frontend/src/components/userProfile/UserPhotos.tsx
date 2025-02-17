import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useUserPhotos } from "../../hooks/useUserPhotos";

const Photos = ({ userInfo, userId }) => {
  const {
    handleFileChangeAndAdd,
    handleDeletePhotos,
    addPhotoStatus,
    deletePhotoStatus,
    selectedPhotos,
  } = useUserPhotos();
  console.log(userInfo);
  return (
    <div className="flex relative items-center w-[90%] h-full m-auto py-2 text-4xl  whitespace-nowrap">
      <div className="bg-[url(./assets/brush-profile-horizontal.png)]  w-[110%] h-full bg-cover  absolute"></div>
      {userInfo.photos?.length > 0 ? (
        userInfo.photos.map((photo) => (
          <div className="inline-block min-w-100 h-[95%] rounded-4xl relative">
            <img
              className="w-full h-full overflow-hidden rounded-4xl"
              src={photo}
            ></img>
            <button
              className="absolute top-[10%] right-4 bg-transparent border-0 text-gray-400 translate-[50% -50%] transition-all"
              onClick={() => handleDeletePhotos(photo)}
              disabled={deletePhotoStatus.isPending}
            >
              {deletePhotoStatus.isPending ? "Deleting..." : "Delete"}X
            </button>
          </div>
        ))
      ) : (
        <></>
      )}

      {userId === userInfo._id && (
        <div className="inline-block min-w-100 h-[95%] rounded-4xl relative">
          <span className="absolute flex top-[50%] left-[50%] w-20 h-20 text-7xl rounded-4xl translate-[-50% -50%] text-center justify-center items-center transition-all">
            +
          </span>
          <input
            type="file"
            id="file-upload"
            className="absolute flex top-[50%] left-[50%] w-20 h-20 text-7xl rounded-4xl translate-[-50% -50%] text-center justify-center items-center transition-all"
            onChange={handleFileChangeAndAdd}
            multiple
          />
        </div>
      )}
    </div>
  );
};

export default Photos;
