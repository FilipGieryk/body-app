import axios from "axios";
import { useState, useEffect } from "react";
import "./UserPhotos.css";

const Photos = ({ userInfo, userId }) => {
  const [userPhotos, setUserPhotos] = useState(userInfo);

  const handleDeletePhoto = async (photoPath) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${userId}/photos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { photoPath },
      });
      setUserPhotos((prevUserInfo) => ({
        ...prevUserInfo,
        photos: prevUserInfo.photos.filter((photo) => photo !== photoPath),
      }));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPhotos((prevUserPhotos) => ({
        ...prevUserPhotos,
        photos: [...prevUserPhotos.photos, response.data.photoPath],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex relative items-center w-[90%] h-full m-auto py-2 text-4xl overflow-x-auto whitespace-nowrap">
      {userPhotos.photos.length > 0 ? (
        userPhotos.photos.map((el) => (
          <div className="inline-block min-w-100 h-[95%] rounded-4xl relative">
            <img
              className="w-full h-full overflow-hidden rounded-4xl"
              src={el}
            ></img>
            <button
              className="absolute top-[10%] right-4 bg-transparent border-0 text-gray-400 translate-[50% -50%] transition-all"
              onClick={() => handleDeletePhoto(el)}
            >
              X
            </button>
          </div>
        ))
      ) : (
        // <div className='photo-container'></div>
        // <p>no photos available</p>
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
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default Photos;
