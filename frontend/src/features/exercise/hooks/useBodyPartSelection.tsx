import { useState } from "react";

export const useBodyPartSelection = () => {
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);

  const handleBodyPartChange = (bodyPart: any) => {
    setSelectedBodyParts((prev) => {
      if (prev.includes(bodyPart)) {
        return prev.filter((part) => part !== bodyPart);
      } else {
        return [...prev, bodyPart];
      }
    });
  };

  return { selectedBodyParts, handleBodyPartChange };
};
