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
    <div className="profile-photos-container">
      {userPhotos.photos.length > 0 ? (
        userPhotos.photos.map((el) => (
          <div className="profile-photo-element">
            <img className="photo" src={el}></img>
            <button
              className="delete-button"
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
        <div className="profile-photo-element">
          <span className="add-photo-icon">+</span>
          <input
            type="file"
            id="file-upload"
            className="add-photo-icon"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default Photos;
