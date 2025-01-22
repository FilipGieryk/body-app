import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    bodyPart: [],
    videoLink: "",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [message, setMessage] = useState("");
  const [bodyPart, setBodyPart] = useState("");

  const [scaleInput, setScaleInput] = useState(null);
  // Fetch existing exercises

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("bodyPart", JSON.stringify(formData.bodyPart));
    formDataToSend.append("videoLink", formData.videoLink);
    if (mediaFile) formDataToSend.append("media", mediaFile);

    console.log("Form Data to Send:", {
      name: formData.name,
      bodyPart: formData.bodyPart,
      media: mediaFile ? mediaFile.name : "No file selected",
      videoLink: formData.videoLink,
    });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/admin/exercises",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }, // Replace with actual token management
        }
      );
      setMessage("Exercise created successfully!");

      setFormData({ name: "", bodyPart: "" }); // Reset form
      setMediaFile(null);
    } catch (err) {
      setMessage("Failed to create exercise.");
      console.error(err);
    }
  };
  const handleBodyPart = (e) => {
    setBodyPart(e.target.value);
  };
  const addBodyPart = (e) => {
    e.preventDefault();
    if (bodyPart.trim() !== "") {
      setFormData({
        ...formData,
        bodyPart: [...formData.bodyPart, { part: bodyPart, scale: 0 }],
      });
      setBodyPart("");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };
  const deleteBodyPart = (e, index) => {
    e.preventDefault();
    setFormData({
      ...formData,
      bodyPart: formData.bodyPart.filter((bp, bindex) => bindex != index),
    });
  };
  const changeBodyPartScale = (index) => {
    if (scaleInput === index) {
      setScaleInput(null); // Close the input if the same item is clicked again
    } else {
      setScaleInput(index); // Show input for the clicked item
    }
  };
  // console.log(formDataToSend);

  const handleScaleChange = (e, index) => {
    const updatedBodyParts = formData.bodyPart.map((bp, bindex) =>
      bindex === index ? { ...bp, scale: Number(e.target.value) } : bp
    );
    setFormData({ ...formData, bodyPart: updatedBodyParts });
  };

  return (
    <>
      <form className="simple-form" onSubmit={handleSubmit}>
        <input
          className="grid-text"
          type="text"
          name="name"
          placeholder="Exercise Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div>
          <input
            className="grid-enum"
            type="text"
            name="bodyPart"
            placeholder="Body Part"
            value={bodyPart}
            onChange={handleBodyPart}
          />
          <button onClick={addBodyPart}>+</button>
          <div className="bodyparts-list">
            {formData.bodyPart.map((bp, index) => (
              <div
                className="bodypart-container"
                onClick={() => changeBodyPartScale(index)}
              >
                {bp.part}
                <button
                  onClick={(e) => deleteBodyPart(e, index)}
                  className="delete-button"
                >
                  x
                </button>
                {scaleInput === index && (
                  <div className="scale-input-container">
                    <input
                      type="range"
                      value={bp.scale || 0}
                      min={0}
                      max={100}
                      onClick={(e) => e.stopPropagation()} // Prevent div click from toggling
                      onChange={(e) => handleScaleChange(e, index)}
                      className="scale-input"
                    />
                    <span className="scale-value">{bp.scale || 0}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <input
          className="grid-photo"
          type="file"
          name="media"
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <input
          className="grid-video"
          type="text"
          name="videoLink"
          onChange={handleChange}
        />
        <button className="grid-button" type="submit">
          Create Exercise
        </button>
      </form>
    </>
  );
};

export default AdminDashboard;
