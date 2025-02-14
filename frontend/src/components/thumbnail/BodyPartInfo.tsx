import { useEffect, useState, useRef } from "react";
import Thumbnail from "./Thumbnail";

const BodyPartInfo = ({ staticInfo, exercises, animationDuration = 5 }) => {
  const [visibleText, setVisibleText] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutIds = useRef([]);
  useEffect(() => {
    setVisibleText([]);
    setCurrentLine(0);

    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  }, [staticInfo]);

  useEffect(() => {
    const totalText = staticInfo[currentLine];

    const addCharacter = (index) => {
      if (index < totalText.length) {
        setVisibleText((prev) => {
          const newText = [...prev];
          newText[currentLine] =
            (newText[currentLine] || "") + totalText[index];
          return newText;
        });
        const id = setTimeout(() => addCharacter(index + 1), animationDuration);
        timeoutIds.current.push(id);
      } else if (currentLine < staticInfo.length - 1) {
        const id = setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
        }, 1000);
        timeoutIds.current.push(id);
      }
    };

    if (staticInfo.length > 0) {
      addCharacter(0);
    }

    const cursorBlinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 700);

    return () => {
      clearInterval(cursorBlinkInterval);
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };
  }, [currentLine, staticInfo, animationDuration]);
  return (
    <div className="absolute top-10 left-10 p-5 bg-black/70 shadow-l blur-[0.6px] w-150 h-200 animate-appear-slow">
      {visibleText.map((text, index) => (
        <div
          key={index}
          className="text-white text-2xl text-left mb-15 font-bold "
        >
          {text}

          {index === currentLine && showCursor && <span>|</span>}
        </div>
      ))}

      {currentLine === 2 && (
        <div className="flex gap-10 animate-appear-fast clip-hide">
          <Thumbnail data={exercises[0]} />
          <Thumbnail data={exercises[1]} />
        </div>
      )}
    </div>
  );
};

export default BodyPartInfo;
