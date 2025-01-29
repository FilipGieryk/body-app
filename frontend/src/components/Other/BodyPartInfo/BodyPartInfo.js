import styles from "./BodyPartInfo.module.css";
import { useEffect, useState, useRef } from "react";
import Thumbnail from "../../Thumbnail/Thumbnail";

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
    <div className={styles.container}>
      {visibleText.map((text, index) => (
        <div key={index} className={styles.animatedText}>
          {text}

          {index === currentLine && showCursor && (
            <span className={styles.cursor}>|</span>
          )}
        </div>
      ))}

      {currentLine === 2 && (
        <div className={styles.exercises}>
          <Thumbnail data={exercises[0]} />
          <Thumbnail data={exercises[1]} />
        </div>
      )}
    </div>
  );
};

export default BodyPartInfo;
