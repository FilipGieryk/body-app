import { data } from "react-router-dom";
import WokroutsList from "../../components/Main/Workouts/WorkoutsList";
import Thumbnail from "../../components/Thumbnail/Thumbnail";
import { useHelpWorkouts } from "../../hooks/useHelpWorkouts";
import { motion } from "framer-motion";
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
      example: ["67952ff76349301c915710ea", "679530b46349301c915713df"],
      workouts: "3-4/week.",
    },
    pushPullLegs: {
      name: "Push Pull Legs",
      info: "A split that divides workouts into pushing, pulling, and legs.",
      pros: "Allows for focused muscle training.",
      cons: "Requires more gym days.",
      example: "Bench press, Pull-ups, Squats, etc.",
      workouts: "6/week.",
    },
    upperLower: {
      name: "Upper Lower",
      info: "A split that targets upper body one day and lower body the next.",
      pros: "Balanced muscle training.",
      cons: "Requires more recovery time.",
      example: "Bench press, Squats, etc.",
      workouts: "4/week.",
    },
    bodyPart: {
      name: "Body Part",
      info: "Focus on one body part per session.",
      pros: "Intense focus on specific muscles.",
      cons: "Longer workout sessions.",
      example: "Leg day, Chest day, etc.",
      workouts: "5-6/week.",
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
  const [clipStage, setClipStage] = useState("top");
  const clipPaths = {
    leftTop: "polygon(0% 0%, 50% 0%, 50% 25%, 0% 25%)",
    leftTopMiddle: "polygon(0% 25%, 50% 25%, 43% 50%, 0% 43%)",
    leftBottomMiddle: "polygon(0% 43%, 50% 50%, 50% 63%, 0% 63%)",
    leftBottom: "polygon(0% 66%, 20% 66%, 20% 100%, 0% 100%)",
    rightBottom: "polygon(50% 50%, 100% 50%, 100% 75%, 50% 75%)",
    rightTop: "polygon(50% 75%, 100% 75%, 100% 100%, 50% 100%)",
  };
  const {
    data: workouts,
    error,
    isLoading,
  } = useHelpWorkouts(selectedSplit.example);
  const handleSplitClick = (split, pos) => {
    setSelectedSplit(splitsInfo[split]);
    setClipStage(pos);
  };
  return (
    <div className="help-container relative after:absolute rounded-2xl [background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_40%,_#000000_100%)] after:[background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_31%,_#000000_100%)]  after:content-[''] after:bg-black after:w-full after:h-full after:blur-3xl after:z-10">
      <div className="[grid-area:top] flex gap-10 text-xl justify-between z-20">
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">difficulty:</p>
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">
          workouts: {selectedSplit.workouts}
        </p>
        <p className="text-red-500 bg-black/20 rounded-2xl p-3">time</p>
      </div>

      <div className="[grid-area:text] z-100 text-white self-stretch">
        <h1 className="mb-20">{selectedSplit.name}</h1>
        <p className="text-xl mb-10">{selectedSplit.info}</p>
        <table className="w-full mb-30">
          <tr>
            <th className="text-xl">Pros</th>
            <th className="text-xl">Cons</th>
          </tr>
          <tr>
            <td className="text-green-400 text-base">{selectedSplit.pros}</td>
            <td className="text-red-400 text-base">{selectedSplit.cons}</td>
          </tr>
        </table>
        <p>{selectedSplit.example}</p>
      </div>

      <div className="flex bg-white justify-around w-120 p-1 rounded-md   [grid-area:footer] z-60">
        <button className="bg-amber-400 rounded-md w-30 h-15 hover:bg-amber-300">
          splits
        </button>
        <button className="bg-amber-400 rounded-md w-30 h-15 hover:bg-amber-300">
          reps
        </button>
      </div>
      <div className="absolute w-[80%] h-[90%] bg-red-400/9 right-[30%]  blur-2xl rounded-[50%] z-50"></div>

      {/* small opacity circle */}
      <div className="absolute justify-around h-[100%] w-[60%] border-1 circle-radius left-[20%] align-middle clip-path-square-right opacity-20 z-30 "></div>
      {/* high opacity circle */}
      <div className="absolute justify-around h-[100%] w-[60%] left-[20%] z-50">
        <motion.div
          className="absolute z-50 w-[100%] h-[100%] circle-radius border-1"
          animate={{ clipPath: clipPaths[clipStage] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        <button
          className="relative left-[-19vw] top-[15%] text-2xl"
          onClick={() => handleSplitClick("fullBody", "leftTop")}
        >
          {splitsInfo.fullBody.name}
        </button>
        <button
          className="relative left-[-31vw] top-[30%] text-2xl"
          onClick={() => handleSplitClick("pushPullLegs", "leftTopMiddle")}
        >
          {splitsInfo.pushPullLegs.name}
          <span className="relative left-[6vw] text-4xl text-red-500">•</span>
        </button>
        <button
          className="relative left-[-40vw] top-[50%] text-2xl"
          onClick={() => handleSplitClick("upperLower", "leftBottomMiddle")}
        >
          {splitsInfo.upperLower.name}

          <span className="relative left-[6vw] text-4xl text-red-500">•</span>
        </button>
        <button
          className="relative left-[-45vw] top-[70%] text-2xl"
          onClick={() => handleSplitClick("bodyPart", "leftBottom")}
        >
          {splitsInfo.bodyPart.name}
          <span className="relative left-[6vw] text-4xl text-red-500">•</span>
        </button>
        <button
          className="relative left-[-45vw] top-[70%] text-2xl"
          onClick={() => handleSplitClick("bodyPart", "rightBottom")}
        >
          {splitsInfo.bodyPart.name}
          <span className="relative left-[6vw] text-4xl text-red-500">•</span>
        </button>
        <button
          className="relative left-[-45vw] top-[70%] text-2xl"
          onClick={() => handleSplitClick("bodyPart", "rightTop")}
        >
          {splitsInfo.bodyPart.name}
          <span className="relative left-[6vw] text-4xl text-red-500">•</span>
        </button>
      </div>
    </div>
  );
};
export default Help;
