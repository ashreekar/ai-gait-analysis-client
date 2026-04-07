export async function GET() {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

  const symmetry = rand(60, 100);

  return Response.json({
    leftFoot: [rand(0, 1023), rand(0, 1023), rand(0, 1023), rand(0, 1023)],
    rightFoot: [rand(0, 1023), rand(0, 1023), rand(0, 1023), rand(0, 1023)],
    symmetry,
    gaitPhase: Math.random() > 0.7 ? "Swing" : "Stance",
    fallRisk: symmetry > 80 ? "Low" : symmetry > 60 ? "Moderate" : "High",
    battery: {
      left: rand(60, 90),
      right: rand(60, 90),
    },
    time: Date.now(),
  });
}