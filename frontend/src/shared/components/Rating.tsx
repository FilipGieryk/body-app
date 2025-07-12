import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRating } from "../hooks/useRating";
import React from "react";

const Rating = ({ itemId, averageRating }) => {
  const [rating, setRating] = useState(0);
  const { submitRating } = useRating(itemId);

  const handleSubmit = async (rating) => {
    submitRating(rating);
  };

  const handleRateClick = (e, selectedRating) => {
    e.preventDefault();
    setRating(selectedRating);
    handleSubmit(selectedRating);
  };
  return (
    <div className="flex justify-end items-center">
      <p className="text-xl">{averageRating}</p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={(e) => handleRateClick(e, star)}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            color: star <= rating ? "gold" : "gray",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
