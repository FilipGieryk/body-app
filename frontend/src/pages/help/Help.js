import WokroutsList from "../../components/Main/Workouts/WorkoutsList";
import "./help.css";
import { useState } from "react";
const Help = () => {
  const splitsInfo = {
    // example add workouts
    fullBody: {
      name: "Full Body",
      info: "A workout that targets all major muscle groups in one session.",
      pros: "Efficient for building overall strength.",
      cons: "Can be tiring if not managed properly.",
      example: "Squats, Deadlifts, Push-ups, etc.",
      workouts: "3-4 times a week.",
    },
    pushPullLegs: {
      name: "Push Pull Legs",
      info: "A split that divides workouts into pushing, pulling, and legs.",
      pros: "Allows for focused muscle training.",
      cons: "Requires more gym days.",
      example: "Bench press, Pull-ups, Squats, etc.",
      workouts: "6 days a week.",
    },
    upperLower: {
      name: "Upper Lower",
      info: "A split that targets upper body one day and lower body the next.",
      pros: "Balanced muscle training.",
      cons: "Requires more recovery time.",
      example: "Bench press, Squats, etc.",
      workouts: "4 days a week.",
    },
    bodyPart: {
      name: "Body Part",
      info: "Focus on one body part per session.",
      pros: "Intense focus on specific muscles.",
      cons: "Longer workout sessions.",
      example: "Leg day, Chest day, etc.",
      workouts: "5-6 days a week.",
    },
    repsSets: {
      name: "Reps and Sets",
      info: "Focus on the number of repetitions and sets for each exercise.",
      pros: "Customizable to individual goals.",
      cons: "Can be confusing for beginners.",
      example: "3 sets of 10 reps.",
      workouts: "Depends on goals.",
    },
  };
  const [selectedSplit, setSelectedSplit] = useState(splitsInfo["fullBody"]);

  const handleSplitClick = (split) => {
    setSelectedSplit(splitsInfo[split]);
  };
  return (
    <div className="help-container">
      <div>
        <h1>
          Split - {selectedSplit ? selectedSplit.name : "Select an option"}
        </h1>
        <div className="selected-content">
          <p>{selectedSplit.info}</p>
          <p className="split-pros">
            <strong>Pros:</strong> {selectedSplit.pros}
          </p>
          <p className="split-cons">
            <strong>Cons:</strong> {selectedSplit.cons}
          </p>
          <p>
            <strong>Workouts:</strong> {selectedSplit.workouts}
          </p>
          <p>
            {/* add three made workouts for upperlower */}
            <strong>Example:</strong>
            {/* <WokroutsList userIfno={selectedSplit.example} /> */}
          </p>
        </div>
      </div>
      {/* 
      
      */}
      <div className="help-nav">
        <div className="help-nav-splits">
          <div className="splits-label">splits</div>
          <div className="splits-options">
            <div onClick={() => handleSplitClick("fullBody")}>Full Body</div>
            <div onClick={() => handleSplitClick("pushPullLegs")}>
              Push Pull Legs
            </div>
            <div onClick={() => handleSplitClick("upperLower")}>
              Upper Lower
            </div>
            <div onClick={() => handleSplitClick("bodyPart")}>Body Part</div>
          </div>
        </div>
        <div className="help-nav-rest">
          <div onClick={() => handleSplitClick("repsSets")}>Reps Sets</div>
        </div>
      </div>
    </div>
  );
};
export default Help;
