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
  const repsInfo = {
    gneralFitnes: {
      name: "General Fitness",
      info: "a",
      pros: "a",
      cons: "a",
    },
    endurance: {
      name: "Endurance",
      info: "a",
      pros: "a",
      cons: "a",
    },
    hypertrophy: {
      name: "Hypertrophy",
      info: "a",
      pros: "a",
      cons: "a",
    },
    muscleStrength: {
      name: "Muscle Strength",
      info: "a",
      pros: "a",
      cons: "a",
    },
    powerSingleRep: {
      name: "Power: Single Rep",
      info: "a",
      pros: "a",
      cons: "a",
    },
    powerMultiReps: {
      name: "Power: Multi Reps",
      info: "a",
      pros: "a",
      cons: "a",
    },
  };
  // category
  const clipPathCategory = {
    left: "inset(0 50% 0 0)",
    right: "inset(0 0 0 50%)",
    translateLeft: "-20%",
    translateRight: "20%",
  };
  const moveX = {
    left: "translateX(-20%)",
    right: "translateX(20%)",
  };
  const [selectCategory, setSelectCategory] = useState("left");
  // section
  const clipPaths = {
    left: {
      first: "polygon(0% 0%, 50% 0%, 25% 25%, 0% 25%)",
      second: "polygon(0% 25%, 50% 25%, 43% 50%, 0% 43%)",
      third: "polygon(0% 43%, 50% 50%, 50% 63%, 0% 63%)",
      fourth: "polygon(0% 66%, 20% 66%, 20% 100%, 0% 100%)",
    },
    right: {
      first: "polygon(50% 50%, 100% 50%, 100% 75%, 50% 75%)",
      second: "polygon(50% 75%, 100% 75%, 100% 100%, 50% 100%)",
    },
  };

  const [selectSection, setSelectSection] = useState("first");

  const [selectedSplit, setSelectedSplit] = useState(splitsInfo);
  const [clipStage, setClipStage] = useState("leftTop");

  const [animateCircles, setAnimateCircles] = useState(false);

  // const {
  //   data: workouts,
  //   error,
  //   isLoading,
  // } = useHelpWorkouts(selectedSplit.example);
  const handleSplitClick = (split, pos) => {
    setSelectedSplit(splitsInfo[split]);
    setClipStage(pos);
  };
  console.log(selectCategory);

  const handleChangeCategory = (category, pos) => {
    setSelectCategory(category);
    // setClipPathSide(category);
    // setMoveX(pos);
    // setAnimateCircles(true);
    // setTimeout(() => setAnimateCircles(false), 500); // Reset after animation
  };
  return (
    <div className="help-container relative after:absolute rounded-2xl [background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_40%,_#000000_100%)] after:[background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_31%,_#000000_100%)]  after:content-[''] after:bg-black after:w-full after:h-full after:blur-3xl after:z-10">
      {/* // top */}
      <div className="[grid-area:top] flex gap-10 text-xl justify-between z-20">
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">difficulty:</p>
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">
          workouts: {selectedSplit.workouts}
        </p>
        <p className="text-red-500 bg-black/20 rounded-2xl p-3">time</p>
      </div>
      {/* context */}
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
      {/* footer */}
      <div className="flex bg-white justify-around w-120 p-1 rounded-md [grid-area:footer] z-60">
        <motion.button
          className="bg-amber-400 rounded-md w-30 h-15 hover:bg-amber-300"
          onClick={() => handleChangeCategory("left")}
          animate={{
            opacity: animateCircles ? 0.5 : 1,
            y: animateCircles ? -10 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          splits
        </motion.button>

        <motion.button
          className="bg-amber-400 rounded-md w-30 h-15 hover:bg-amber-300"
          onClick={() => handleChangeCategory("right")}
          animate={{
            opacity: animateCircles ? 0.5 : 1,
            y: animateCircles ? -10 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          reps
        </motion.button>
      </div>
      {/* light circle */}
      <motion.div
        className="absolute w-[80%] h-[90%] bg-red-400/9 right-[12%]  blur-2xl rounded-[50%] z-50"
        animate={{ transform: moveX[selectCategory] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {/* low opacity circle */}
      <motion.div
        className="absolute justify-around h-[100%] w-[60%] border-1 circle-radius left-[20%] align-middle opacity-20 z-30 "
        animate={{
          clipPath: clipPathCategory[selectCategory],
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {/* high opacity circle*/}
      <div className="absolute justify-around h-[100%] w-[60%] left-[20%] z-50">
        <motion.div
          className="absolute h-[100%] w-[100%] circle-radius border-2 z-50"
          animate={{ clipPath: clipPaths[selectCategory][selectSection] }}
        />
        {Object.keys(splitsInfo).map((splitKey, index) => (
          <motion.button
            key={splitKey}
            className="relative left-[-45vw] text-2xl hover:text-white"
            // instead of 18 make smthing like 100/splitsInfo
            style={{ top: `${18 * index}%` }}
            onClick={() => handleChangeCategory()}
            animate={{}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {index}
            {splitsInfo[splitKey].name}
            <span className="relative left-[6vw] text-4xl text-red-500">•</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
export default Help;
