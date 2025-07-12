import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminDashboard = () => {
  const { id } = useParams();
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
  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
  const addBodyPart = (e: { preventDefault: () => void }) => {
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
  const deleteBodyPart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    setFormData({
      ...formData,
      bodyPart: formData.bodyPart.filter((bp, bindex) => bindex != index),
    });
  };
  const changeBodyPartScale = (index: number | React.SetStateAction<null>) => {
    if (scaleInput === index) {
      setScaleInput(null); // Close the input if the same item is clicked again
    } else {
      setScaleInput(index); // Show input for the clicked item
    }
  };
  // console.log(formDataToSend);

  const handleScaleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedBodyParts = formData.bodyPart.map((bp: any, bindex) =>
      bindex === index ? { ...bp, scale: Number(e.target.value) } : bp
    );
    setFormData({ ...formData, bodyPart: updatedBodyParts });
  };

  return (
    <>
      <form
        className="grid w-full grid-cols-3 grid-rows-3 h-full justify-items-center items-center m-auto"
        onSubmit={handleSubmit}
      >
        <input
          className="col-start-1 col-end-3 row-start-1 row-end-1 text-center"
          type="text"
          name="name"
          placeholder="Exercise Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div>
          <input
            className="col-start-3 row-start-1 row-end-1"
            type="text"
            name="bodyPart"
            placeholder="Body Part"
            value={bodyPart}
            onChange={handleBodyPart}
          />
          <button onClick={addBodyPart}>+</button>
          <div className="grid grid-cols-2 gap-4">
            {formData.bodyPart.map((bp: any, index) => (
              <div
                className="w-28 h-12 inline-block text-center bg-amber-800 text-2xl rounded-2xl"
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
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleScaleChange(e, index)}
                      className="scale-input"
                    />
                    <span className="text-2xl text-black">{bp.scale || 0}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <input
          className="col-start-3 row-start-2"
          type="file"
          name="media"
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <input
          className="col-start-1 col-end-2 row-start-2"
          type="text"
          name="videoLink"
          onChange={handleChange}
        />
        <button className="col-start-1 col-end-4 row-start-3" type="submit">
          Create Exercise
        </button>
      </form>
    </>
  );
};

export default AdminDashboard;
