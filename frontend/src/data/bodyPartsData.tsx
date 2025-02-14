const bodyPartsData = {
  chest: [
    "BODY PART: Chest",
    "FUNCTIONALITY: Chest muscles primarily perform horizontal flexion, shoulder adduction, shoulder flexion, and assist with internal rotation of the arms.",
    'PARTS: ["PECTORALIS_MAJOR", "PECTORALIS_MINOR", "SERRATUS_ANTERIOR", "SUBCLAVIUS"]',
  ],
  arms: [
    "BODY PART: Arms",
    "FUNCTIONALITY: Arm muscles enable flexion and extension at the elbow and shoulder joints.",
    'PARTS: ["BICEPS_BRACHII", "TRICEPS_BRAchii", "BRACHIALIS"]',
  ],
  biceps: [
    "BODY PART: Biceps",
    "FUNCTIONALITY: Biceps muscles are responsible for flexing the elbow and rotating the forearm.",
    'PARTS: ["BICEPS_BRACHII", "BRACHIALIS"]',
  ],
  triceps: [
    "BODY PART: Triceps",
    "FUNCTIONALITY: Triceps muscles enable extension of the elbow joint and assist in shoulder stability.",
    'PARTS: ["TRICEPS_BRAchii"]',
  ],
  traps: [
    "BODY PART: Trapezius",
    "FUNCTIONALITY: Trapezius muscles stabilize and move the shoulder blades and support the neck.",
    'PARTS: ["TRAPEZIUS"]',
  ],
  hamstrings: [
    "BODY PART: Hamstrings",
    "FUNCTIONALITY: Hamstrings are responsible for bending the knee and extending the hip joint.",
    'PARTS: ["BICEPS_FEMORIS", "SEMIMEMBRANOSUS", "SEMITENDINOSUS"]',
  ],
  quads: [
    "BODY PART: Quadriceps",
    "FUNCTIONALITY: Quadriceps muscles extend the knee and are crucial for walking, running, and jumping.",
    'PARTS: ["RECTUS_FEMORIS", "VASTUS_LATERALIS", "VASTUS_MEDIALIS", "VASTUS_INTERMEDIUS"]',
  ],
  calves: [
    "BODY PART: Calves",
    "FUNCTIONALITY: Calf muscles are responsible for plantar flexion of the foot and flexing the knee.",
    'PARTS: ["GASTROCNEMIUS", "SOLEUS"]',
  ],
  glutes: [
    "BODY PART: Glutes",
    "FUNCTIONALITY: Gluteal muscles help with hip extension, rotation, and stabilization.",
    'PARTS: ["GLUTEUS_MAXIMUS", "GLUTEUS_MEDIUS", "GLUTEUS_MINIMUS"]',
  ],
  core: [
    "BODY PART: Core",
    "FUNCTIONALITY: Core muscles support the spine and assist in maintaining posture and balance.",
    'PARTS: ["RECTUS_ABDOMINIS", "OBLIQUES", "TRANSVERSUS_ABDOMINIS"]',
  ],
  rhomboids: [
    "BODY PART: Rhomboids",
    "FUNCTIONALITY: Rhomboid muscles retract the scapula and help stabilize the shoulder blades.",
    'PARTS: ["RHOMBOID_MAJOR", "RHOMBOID_MINOR"]',
  ],
  lats: [
    "BODY PART: Latissimus Dorsi",
    "FUNCTIONALITY: Latissimus dorsi muscles enable shoulder adduction, extension, and internal rotation.",
    'PARTS: ["LATISSIMUS_DORSI"]',
  ],
};

export const getBodyPartInfo = (partName) => {
  if (!partName || typeof partName !== "string") {
    return null;
  }
  const lowerCasePartName = partName.toLowerCase();
  return bodyPartsData[lowerCasePartName] || null;
};
