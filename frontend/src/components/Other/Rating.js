import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRating } from "../../hooks/useRating";

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
    <div>
      <p style={{ display: "inline-block" }}>{averageRating}</p>
      {/* {userId && */}
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
