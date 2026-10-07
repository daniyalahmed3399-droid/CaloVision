// Hard-coded daily tips for the dashboard card. General wellbeing advice
// only (no medical claims). They alternate between fitness and nutrition.

export const TIP_CATEGORIES = {
  fitness: "Fitness",
  nutrition: "Nutrition",
};

export const TIPS = [
  {
    category: "fitness",
    text: "Aim for about 150 minutes of moderate activity a week. A brisk 30-minute walk, five days a week, gets you there.",
  },
  {
    category: "nutrition",
    text: "Fill half your plate with vegetables and fruit at most meals. They add volume and fibre without many calories.",
  },
  {
    category: "fitness",
    text: "Warm up for 5 minutes before you exercise. Easy movement raises your heart rate and loosens your joints.",
  },
  {
    category: "nutrition",
    text: "Include some protein at every meal, like eggs, yogurt, chicken, fish, beans or lentils. It helps you feel full for longer.",
  },
  {
    category: "fitness",
    text: "Strength training two days a week helps you keep muscle while you lose weight.",
  },
  {
    category: "nutrition",
    text: "Drink water through the day. Thirst is easy to mistake for hunger.",
  },
  {
    category: "fitness",
    text: "Take the stairs, park a bit farther away, or walk while you take calls. Small bursts of movement add up.",
  },
  {
    category: "nutrition",
    text: "Choose whole grains like oats, brown rice and whole wheat bread for steadier energy and more fibre.",
  },
  {
    category: "fitness",
    text: "If you sit most of the day, stand up and move for a couple of minutes every hour.",
  },
  {
    category: "nutrition",
    text: "Weigh or measure your food for a week. It teaches you what a real serving looks like.",
  },
  {
    category: "fitness",
    text: "Rest days are part of training. Your muscles get stronger while they recover, so don't skip them.",
  },
  {
    category: "nutrition",
    text: "Eat slowly. It takes about 20 minutes for your body to signal that you're full.",
  },
  {
    category: "fitness",
    text: "Pick an activity you enjoy. The best workout is the one you'll keep doing.",
  },
  {
    category: "nutrition",
    text: "Swap sugary drinks for water, sparkling water or unsweetened tea.",
  },
  {
    category: "fitness",
    text: "Focus on form before weight. Slow, controlled reps are safer and work your muscles better.",
  },
  {
    category: "nutrition",
    text: "Healthy fats like olive oil, avocado and nuts are good for you, but they're calorie-dense, so measure them.",
  },
  {
    category: "fitness",
    text: "Aim for 7 to 9 hours of sleep when you can. Good sleep supports recovery, energy and appetite control.",
  },
  {
    category: "nutrition",
    text: "Plan your meals ahead. A simple weekly plan makes it easier to avoid last-minute choices.",
  },
  {
    category: "fitness",
    text: "Track your steps for a week to find your baseline, then raise your daily goal by 500 to 1,000 steps.",
  },
  {
    category: "nutrition",
    text: "Keep fruit, nuts or yogurt handy so a snack doesn't turn into a trip for something less filling.",
  },
  {
    category: "fitness",
    text: "Stretch gently after exercise while your muscles are warm, and hold each stretch for 20 to 30 seconds.",
  },
  {
    category: "nutrition",
    text: "Don't skip meals to save calories. Regular meals help keep your energy and cravings steady.",
  },
  {
    category: "fitness",
    text: "Mix it up. Cardio, strength and flexibility work together, so try to include all three each week.",
  },
  {
    category: "nutrition",
    text: "Log your food as you eat it. It's quicker and more accurate than trying to remember at the end of the day.",
  },
];

// A different tip to start on each calendar day, so the card doesn't open on
// the same one every visit. `date` is a local "YYYY-MM-DD" string.
export function startingTipIndex(date) {
  const [year, month, day] = String(date).split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86400000);

  return Number.isFinite(dayNumber) ? Math.abs(dayNumber) % TIPS.length : 0;
}
