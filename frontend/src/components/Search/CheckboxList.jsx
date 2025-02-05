import { useState } from "react";
const CheckboxList = ({ handleBodyPartChange, selectedBodyParts }) => {
  const [showBodyParts, setShowBodyParts] = useState(false);
  const bodyParts = ["biceps", "triceps", "chest", "back", "legs", "shoulder"];

  return (
    <>
      <div className="relative flex items-center justify-center w-60 h-10 rounded-xl text-xl bg-amber-200 shadow-lg z-100">
        <div
          className="z-100"
          onClick={() => setShowBodyParts(!showBodyParts)}
          style={{ cursor: "pointer" }}
        >
          {showBodyParts ? "Hide Body Parts" : "Select Body Parts"}
        </div>
        {showBodyParts && (
          <div className="flex flex-col absolute bg-amber-200 w-full h-fit rounded-xl py-2 top-6 ">
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
