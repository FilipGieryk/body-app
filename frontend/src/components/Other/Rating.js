import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Rating = ({ contentId, userId, averageRating, contentType }) => {
  const [rating, setRating] = useState(0);
  const rateWorkout = async (selectedRating) => {
    try {
      if (selectedRating < 1 || selectedRating > 5) {
        throw new Error("rating must be between 1 and 5");
      }
      const response = await axios.post(`api/rating/${contentId}`, {
        userId: userId,
        contentId: contentId,
        contentType: contentType,
        rating: selectedRating,
      });

      console.log("rating updatedsuccesfuly");
      setRating(selectedRating);
    } catch (error) {
      console.error("error updateing rating ", error.response);
    }
  };

  const handleRateClick = (e, selectedRating) => {
    e.preventDefault();
    setRating(selectedRating);
    rateWorkout(selectedRating);
  };
  return (
    <div>
      <p style={{ display: "inline-block" }}>{averageRating}</p>
      {userId &&
        [1, 2, 3, 4, 5].map((star) => (
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
