// lib/mockData.ts
// Centralized dummy data for all pages

export const patientProfile = {
  name: "Arjun K.",
  initials: "AK",
  surgery: "Right Total Knee Replacement",
  surgeryShort: "Right TKR",
  postOpWeek: 6,
  surgeryDate: "2025-02-24",
  dob: "1968-05-14",
  age: 56,
  height: 172,
  weight: 78,
  clinician: "Dr. Sara Mohan George",
  targetSpeed: 0.8,
  targetSymmetry: 85,
  operatedLeg: "right" as const,
};

export const currentMetrics = {
  rehabScore: 60,
  rehabTrend: "Increasing" as const,
  symmetryIndex: 71,
  walkingSpeed: 0.74,
  groundContactTime: 748,
  fallRisk: "Moderate" as const,
  fallRiskScore: 42,
  activityCompliance: 86,
  painScore: 3,
  cadence: 88,
  stepLength: 0.52,
  stanceLeft: 68,
  swingLeft: 32,
  stanceRight: 60,
  swingRight: 40,
  asymmetry: 12,
  stepLengthLeft: 0.48,  // meters (Operated)
  stepLengthRight: 0.54, // meters (Healthy)
  stepLengthTarget: 0.62,
  strideLength: 1.02, // Total distance (m)
  strideLengthTarget: 1.35, // Clinical goal
  strideFrequency: 44, // Strides per minute (Cadence / 2)
  dailySteps: 4280,
  stepGoal: 6000,
  activeMinutes: 24,
  medialArchPressure: 45, // kPa or relative units
  lateralArchPressure: 28, 
  totalFootPressure: 73,
  // Pronation Index = (45 - 28) / 73 * 100 = ~23.2%
  pronationIndex: 23.2,
  pronationLeft: 9.2,   // Degrees (Slight overpronation on op-side)
  pronationRight: 5.8,  // Degrees (Normal)
  pronationStatus: "Moderate Eversion",
  gctLeft: 785,  // ms (Operated - showing hesitation)
  gctRight: 640, // ms (Healthy - within normal range)
  gctThreshold: 700, // Clinical normal upper limit
  symmetry: 71,
  stanceRatio: 88, // (60% op / 68% unop) * 100
  painIndex: 70,   // 100 - (30/100)
  speedRatio: 85,  // (0.74 / 0.87 age-normal) * 100
};

export const weeklyProgress = [
  { week: 2, symmetry: 52, speed: 0.52, rehabScore: 22, fallRisk: 78, pain: 8 },
  { week: 4, symmetry: 62, speed: 0.57, rehabScore: 29, fallRisk: 70, pain: 6 },
  { week: 6, symmetry: 71, speed: 0.61, rehabScore: 36, fallRisk: 62, pain: 5 },
  { week: 8, symmetry: 79, speed: 0.66, rehabScore: 42, fallRisk: 54, pain: 4 },
  { week: 10, symmetry: 84, speed: 0.69, rehabScore: 51, fallRisk: 45, pain: 3 },
  { week: 12, symmetry: 88, speed: 0.71, rehabScore: 60, fallRisk: 38, pain: 2 },
];

export const sessionHistory = [
  {
    id: "s001",
    date: "2026-04-08",
    dateLabel: "Today",
    duration: "18 min",
    steps: 1240,
    symmetry: 71,
    speed: 0.74,
    gct: 748,
    fallRisk: "Moderate",
    rehabScore: 60,
    pain: 3,
    stanceLeft: 68,
    stanceRight: 60,
  },
  {
    id: "s002",
    date: "2026-04-06",
    dateLabel: "Apr 6",
    duration: "15 min",
    steps: 1080,
    symmetry: 68,
    speed: 0.71,
    gct: 762,
    fallRisk: "Moderate",
    rehabScore: 57,
    pain: 4,
    stanceLeft: 69,
    stanceRight: 60,
  },
  {
    id: "s003",
    date: "2026-04-04",
    dateLabel: "Apr 4",
    duration: "20 min",
    steps: 1410,
    symmetry: 65,
    speed: 0.68,
    gct: 771,
    fallRisk: "Moderate",
    rehabScore: 54,
    pain: 4,
    stanceLeft: 70,
    stanceRight: 60,
  },
  {
    id: "s004",
    date: "2026-04-02",
    dateLabel: "Apr 2",
    duration: "12 min",
    steps: 840,
    symmetry: 62,
    speed: 0.64,
    gct: 790,
    fallRisk: "High",
    rehabScore: 48,
    pain: 5,
    stanceLeft: 71,
    stanceRight: 59,
  },
  {
    id: "s005",
    date: "2026-03-30",
    dateLabel: "Mar 30",
    duration: "16 min",
    steps: 1120,
    symmetry: 58,
    speed: 0.60,
    gct: 812,
    fallRisk: "High",
    rehabScore: 42,
    pain: 6,
    stanceLeft: 72,
    stanceRight: 58,
  },
  {
    id: "s006",
    date: "2026-03-27",
    dateLabel: "Mar 27",
    duration: "10 min",
    steps: 680,
    symmetry: 53,
    speed: 0.55,
    gct: 840,
    fallRisk: "High",
    rehabScore: 35,
    pain: 7,
    stanceLeft: 73,
    stanceRight: 57,
  },
];

export const gctOverSession = Array.from({ length: 20 }, (_, i) => ({
  stride: i + 1,
  gct: Math.round(720 + Math.sin(i * 0.5) * 40 + (Math.random() - 0.5) * 50),
}));

export const painVsSymmetry = [
  { pain: 8, symmetry: 48 },
  { pain: 7, symmetry: 54 },
  { pain: 6, symmetry: 59 },
  { pain: 5, symmetry: 63 },
  { pain: 4, symmetry: 68 },
  { pain: 3, symmetry: 72 },
  { pain: 2, symmetry: 78 },
  { pain: 1, symmetry: 82 },
];

// Left foot (operated) - low pressure lateral offloading
export const pressureGridLeft = [
  [5, 8, 22, 35],
  [6, 10, 28, 42],
  [8, 12, 35, 48],
  [10, 15, 18, 20],
];

// Right foot (unoperated) - normal loading
export const pressureGridRight = [
  [72, 85, 90, 88],
  [68, 78, 82, 80],
  [55, 65, 72, 70],
  [45, 52, 50, 48],
];

export const exercises = [
  {
    id: "e1",
    name: "Single-leg Stance",
    sets: 3,
    duration: "30 sec",
    target: "Weight bearing: 80%",
    category: "Balance",
    difficulty: "Moderate",
    icon: "🦵",
    completed: false,
  },
  {
    id: "e2",
    name: "Heel-Toe Walking",
    sets: 2,
    duration: "10 m",
    target: "Symmetry target: >70%",
    category: "Gait",
    difficulty: "Easy",
    icon: "🚶",
    completed: true,
  },
  {
    id: "e3",
    name: "Straight Leg Raise",
    sets: 3,
    duration: "15 reps",
    target: "Quad strength",
    category: "Strength",
    difficulty: "Easy",
    icon: "💪",
    completed: true,
  },
  {
    id: "e4",
    name: "Step-up Exercise",
    sets: 2,
    duration: "10 reps",
    target: "Operated leg lead",
    category: "Functional",
    difficulty: "Moderate",
    icon: "🏃",
    completed: false,
  },
];

export const glossary = [
  { term: "Gait", def: "The pattern of walking or locomotion" },
  { term: "Stance Phase", def: "When the foot is in contact with the ground (~60% of gait cycle)" },
  { term: "Swing Phase", def: "When the foot is off the ground moving forward (~40% of gait cycle)" },
  { term: "Heel Strike", def: "Initial contact of heel with ground — start of stance phase" },
  { term: "Symmetry Index (SI)", def: "Quantitative measure of how similar left and right gait patterns are. SI = |L-R| / (0.5×(L+R)) × 100%" },
  { term: "Ground Contact Time", def: "Duration foot remains on ground during stance phase (normal: 600–700ms)" },
  { term: "Cadence", def: "Number of steps taken per minute (normal adult: 100–120 spm)" },
  { term: "Fall Risk", def: "Probability of losing balance during locomotion. Score 0–100: <30 Low, 31–60 Moderate, >60 High" },
  { term: "Plantar Pressure", def: "Force distribution under the foot during standing/walking" },
  { term: "ACL Re-injury Risk", def: "Likelihood of anterior cruciate ligament re-tear; 30–40% higher when asymmetry >15%" },
];

export const radarData = {
  symmetry: 71,
  pronation: 65,
  balance: 58,
  gct: 62,
  speed: 55,
  load: 70,
};

export const gaitFormulas = {
  stepLengthFormula: "Height (m) × 0.415",
  imuVelocity: "∫∫ acceleration dt",
  normalRange: "0.45m - 0.65m"
};

export type FallRisk = "Low" | "Moderate" | "High";
export type Trend = "Increasing" | "Decreasing" | "Stable";