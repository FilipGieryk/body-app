import { useState } from "react";
import "./CheckboxList.css";
const CheckboxList = ({ handleBodyPartChange, selectedBodyParts }) => {
  const [showBodyParts, setShowBodyParts] = useState(false);
  const bodyParts = ["biceps", "triceps", "chest", "back", "legs", "shoulder"];

  return (
    <>
      <div className="checkbox-container">
        <div
          onClick={() => setShowBodyParts(!showBodyParts)}
          style={{ cursor: "pointer" }}
        >
          {showBodyParts ? "Hide Body Parts" : "Select Body Parts"}
        </div>
        {showBodyParts && (
          <div className="checkbox-elements-list">
            {bodyParts.map((bodyPart) => (
              <label key={bodyPart}>
                <input
                  type="checkbox"
                  checked={selectedBodyParts.includes(bodyPart)}
                  onChange={() => handleBodyPartChange(bodyPart)}
                />
                {bodyPart}
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckboxList;
