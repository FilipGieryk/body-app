import { motion } from "framer-motion";
import React from "react";
import { useState } from "react";
const Help = () => {
  const splitsInfo = {
    left: {
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
    },
    right: {
      generalFitness: {
        name: "generalFitness",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
      endurance: {
        name: "Endurance",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
      hypertrophy: {
        name: "Hypertrophy",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
      muscleStrength: {
        name: "MuscleStrength",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
      powerSingleRep: {
        name: "Power: Single Rep",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
      powerMultiReps: {
        name: "Power: Multi Reps",
        info: "Focus on the number of repetitions and sets for each exercise.",
        pros: "Customizable to individual goals.",
        cons: "Can be confusing for beginners.",
        example: "3 sets of 10 reps.",
        workouts: "Depends on goals.",
      },
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
    fullBody: "inset(0 50% 70% 0)",
    pushPullLegs: "inset(30% 50% 50% 0)",
    upperLower: "inset(50% 50% 30% 0)",
    bodyPart: "inset(70% 50% 0% 0)",
    generalFitness: "inset(0 0 74% 50%)",
    endurance: "inset(27% 0 62% 50%)",
    hypertrophy: "inset(38% 0 50% 50%)",
    muscleStrength: "inset(51% 0 37% 50%)",
    powerSingleRep: "inset(63% 0 26% 50%)",
    powerMultiReps: "inset(75% 0 0% 50%)",
  };
  const [selectSection, setSelectSection] = useState("fullBody");
  // is necessary
  const [selectSplit, setSelectSplit] = useState(
    splitsInfo[selectCategory][selectSection]
  );

  const [animateCircles, setAnimateCircles] = useState(false);

  const handleSectionClick = (split: React.SetStateAction<string>) => {
    setSelectSection(split);
    setSelectSplit(splitsInfo[selectCategory][split]);
  };

  const handleChangeCategory = (category: string) => {
    setSelectCategory(category);
    setSelectSection(Object.keys(splitsInfo[category])[0]);
    setSelectSplit(splitsInfo[category][Object.keys(splitsInfo[category])[0]]);
  };
  return (
    <div className="grid grid-cols-5 grid-rows-[1fr 3fr 1fr] justify-between items-center h-full min-w-full justify-items-center relative after:absolute rounded-2xl [background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_40%,_#000000_100%)] after:[background-image:linear-gradient(243deg,_#000000_1%,_#3b0a18_31%,_#000000_100%)]  after:content-[''] after:bg-black after:w-full after:h-full after:blur-3xl after:z-10">
      {/* // top */}
      <div className="col-start-3 row-start-0 flex gap-10 text-xl justify-between z-20">
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">difficulty:</p>
        <p className="text-red-500 bg-white/10 rounded-2xl p-3">
          workouts: {selectSplit.workouts}
        </p>
        <p className="text-red-500 bg-black/20 rounded-2xl p-3">time</p>
      </div>
      {/* middle */}
      <div className="col-start-1 col-end-6 row-start-2 row-end-3 z-100 text-white self-stretch">
        <h1 className="mb-20">{selectSplit.name}</h1>
        <p className="text-xl mb-10">{selectSplit.info}</p>
        <table className="w-full mb-30">
          <tr>
            <th className="text-xl">Pros</th>
            <th className="text-xl">Cons</th>
          </tr>
          <tr>
            <td className="text-green-400 text-base">{selectSplit.pros}</td>
            <td className="text-red-400 text-base">{selectSplit.cons}</td>
          </tr>
        </table>
        <p>{selectSplit.example}</p>
      </div>
      {/* bottom */}
      <div className="flex bg-white justify-around w-120 p-1 rounded-md col-start-1 col-end-6 row-start-3 z-60">
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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-1/2 h-[90vh] w-[90vh] circle-radius border-1 opacity-20 z-30 "
        animate={{
          clipPath: clipPathCategory[selectCategory],
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-1/2 h-[90vh] w-[90vh] z-50">
        {/* high opacity circle*/}
        <motion.div
          className="absolute h-full w-full circle-radius border-2 z-50"
          animate={{ clipPath: clipPaths[selectSection] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {Object.keys(splitsInfo[selectCategory]).map(
          (splitKey, index, array) => {
            const totalButtons = array.length;
            const radius = 50;
            const angleStep = (Math.PI * 0.4) / (totalButtons - 1);
            const angle = index * angleStep - Math.PI / 0.455;
            const xPos = radius * Math.cos(angle);
            const yPos = radius * Math.sin(angle);

            return (
              <motion.button
                key={`${splitKey}-${selectCategory}`}
                className="absolute text-2xl hover:text-white w-40 h-40 text-gray-500 focus:text-white"
                style={{
                  transform: `translate(-50%, -50%)`,
                  top: `calc(50% + ${yPos}%)`,
                  left:
                    selectCategory === "left"
                      ? `calc(50% - ${xPos}%)`
                      : `calc(50% + ${xPos}%)`,
                }}
                onClick={() => handleSectionClick(splitKey)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                •
                <span
                  className="absolute w-40 h-20 "
                  style={{
                    left: selectCategory === "left" ? `-70%` : `70%`,
                  }}
                >
                  {splitsInfo[selectCategory][splitKey].name}
                </span>
              </motion.button>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Help;
