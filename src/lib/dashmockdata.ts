// lib/mockData.ts

// --- Patient Profile & Baselines ---
export const patientProfile = {
  name: "Arjun K.",
  initials: "AK",
  surgery: "Right Total Knee Replacement",
  surgeryShort: "Right TKR",
  postOpWeek: 6,
  surgeryDate: "2026-02-24",
  clinician: "Dr. Sara Mohan George",
  targetSpeed: 0.8, // m/s (Discharge threshold)
  targetSymmetry: 85, // % (ACL re-injury risk drop threshold)
  operatedLeg: "right" as const,
};

// --- Live Session Baselines (Week 6) ---
export const currentMetrics = {
  rehabScore: 60, 
  rehabTrend: "Increasing" as const,
  symmetryIndex: 71, // SI formula result
  walkingSpeed: 0.61, // m/s
  groundContactTime: 748, // ms (Elevated due to hesitation on operated leg)
  fallRisk: "Moderate" as const,
  fallRiskScore: 42, 
  painScore: 3, // 0-10 scale
  cadence: 88, // steps/min (Early rehab zone)
  stepLength: 0.52, // m
  // Stance/Swing Ratio - showing protective gait on operated (right) leg
  stanceLeft: 60, // Unoperated (Normal ~60%)
  swingLeft: 40,
  stanceRight: 68, // Operated (Elevated stance ~68%)
  swingRight: 32,
  asymmetry: 12, // %
};

// --- Graph 1, 4, 7 & 8: Weekly Progress Trend ---
// Clinically sound progression from Week 2 to Week 12
export const weeklyProgress = [
  { week: 2, symmetry: 52, speed: 0.42, rehabScore: 22, fallRisk: 78, pain: 8 },
  { week: 4, symmetry: 62, speed: 0.51, rehabScore: 35, fallRisk: 65, pain: 6 },
  { week: 6, symmetry: 71, speed: 0.61, rehabScore: 50, fallRisk: 42, pain: 5 },
  { week: 8, symmetry: 79, speed: 0.72, rehabScore: 65, fallRisk: 30, pain: 4 },
  { week: 10, symmetry: 84, speed: 0.78, rehabScore: 72, fallRisk: 20, pain: 2 },
  { week: 12, symmetry: 89, speed: 0.85, rehabScore: 85, fallRisk: 12, pain: 1 }, // Hits discharge criteria
];

// --- Radar Chart: Rehab Composite Score Breakdown ---
export const radarData = [
  { subject: 'Symmetry', value: 71, fullMark: 100 },
  { subject: 'Stance Ratio', value: 85, fullMark: 100 }, // 100 = perfect 60/40 ratio
  { subject: 'Pace (Speed)', value: 76, fullMark: 100 }, // % of target speed
  { subject: 'Pain Free', value: 70, fullMark: 100 }, // Inverted: 100 - (pain * 10)
  { subject: 'Compliance', value: 90, fullMark: 100 }, // Exercise completion
];

// --- Graph 3: Ground Contact Time (GCT) Session Variability ---
// Generates 50 strides showing fatigue setting in (GCT increasing)
export const generateGctSessionData = () => {
  return Array.from({ length: 50 }).map((_, i) => {
    // Base GCT is 700, drifts upward by 1ms per stride + random noise
    const baseGct = 700 + i * 1.5; 
    const noise = (Math.random() - 0.5) * 40; 
    return {
      stride: i + 1,
      gct: Math.round(baseGct + noise),
    };
  });
};

// --- Daily Physio Modules ---
export const exercises = [
  { id: 1, name: "Heel Slides", sets: 3, target: "10 reps", icon: "🦿", completed: true },
  { id: 2, name: "Straight Leg Raises", sets: 3, target: "15 reps", icon: "⬆️", completed: true },
  { id: 3, name: "Single-Leg Stance", sets: 2, target: "30 seconds", icon: "⚖️", completed: false },
  { id: 4, name: "Ankle Pumps", sets: 3, target: "20 reps", icon: "🔄", completed: false },
];