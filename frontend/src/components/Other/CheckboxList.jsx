import { useState } from "react";
const CheckboxList = ({ handleBodyPartChange, selectedBodyParts }) => {
  const [showBodyParts, setShowBodyParts] = useState(false);
  const bodyParts = ["biceps", "triceps", "chest", "back", "legs", "shoulder"];

  return (
    <>
      <div className="w-xs text-base top-24 right-xs">
        <div
          onClick={() => setShowBodyParts(!showBodyParts)}
          style={{ cursor: "pointer" }}
        >
          {showBodyParts ? "Hide Body Parts" : "Select Body Parts"}
        </div>
        {showBodyParts && (
          <div className="flex flex-col absolute bg-amber-200 w-full h-full">
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
