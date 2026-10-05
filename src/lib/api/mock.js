// MOCK BACKEND — development stand-in only.
//
// It keeps users in localStorage so the full auth + onboarding flow can be
// built and tested before the real API exists. Everything here is replaced
// by real API calls; nothing in the UI depends on how this works.
//
// The calorie/macro targets are computed here, not in the UI, because the
// guide says targets must come from the backend.

import { ApiError } from "./errors";

const DB_KEY = "cv_mock_db";
export const MOCK_RESET_CODE = "123456";

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { users: [] };
  } catch {
    return { users: [] };
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function publicUser(user) {
  const { password: _password, ...rest } = user;
  return rest;
}

function userFromToken(db, token) {
  const id = token?.replace("mock-", "");
  const user = db.users.find((u) => u.id === id);

  if (!user) throw new ApiError(401, "Your session has expired. Please log in again.");

  return user;
}

const ACTIVITY_MULTIPLIER = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const GOAL_ADJUSTMENT = { lose: -0.15, maintain: 0, gain: 0.15 };

function computeTargets(profile) {
  const { age, gender, heightCm, weightKg, activity, goal } = profile;

  const bmr =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    (gender === "male" ? 5 : -161);

  const maintenance = bmr * ACTIVITY_MULTIPLIER[activity];
  const calories = Math.round(maintenance * (1 + GOAL_ADJUSTMENT[goal]));

  return {
    calories,
    proteinG: Math.round((calories * 0.25) / 4),
    carbsG: Math.round((calories * 0.45) / 4),
    fatG: Math.round((calories * 0.3) / 9),
    bmi: Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10,
  };
}

export const mockApi = {
  async register({ email, password }) {
    await delay();
    const db = readDb();

    if (db.users.some((u) => u.email === email.toLowerCase())) {
      throw new ApiError(409, "An account with this email already exists.", {
        email: "This email is already in use.",
      });
    }

    const user = {
      id: `${Date.now()}`,
      email: email.toLowerCase(),
      password,
      name: "",
      onboarded: false,
      profile: null,
      targets: null,
    };

    db.users.push(user);
    writeDb(db);

    return { token: `mock-${user.id}`, user: publicUser(user) };
  },

  async login({ email, password }) {
    await delay();
    const db = readDb();

    const user = db.users.find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );

    if (!user) throw new ApiError(401, "Incorrect email or password.");

    return { token: `mock-${user.id}`, user: publicUser(user) };
  },

  async forgotPassword({ email }) {
    await delay();
    // Always succeeds so the response never reveals which emails exist.
    console.info(`[mock] Reset code for ${email}: ${MOCK_RESET_CODE}`);
    return { ok: true };
  },

  async resetPassword({ email, code, password }) {
    await delay();

    if (code !== MOCK_RESET_CODE) {
      throw new ApiError(400, "That code is invalid or has expired.", {
        code: "Invalid or expired code.",
      });
    }

    const db = readDb();
    const user = db.users.find((u) => u.email === email.toLowerCase());

    if (user) {
      user.password = password;
      writeDb(db);
    }

    return { ok: true };
  },

  async currentUser({ token }) {
    await delay(200);
    return publicUser(userFromToken(readDb(), token));
  },

  async saveOnboarding({ token, profile }) {
    await delay(700);
    const db = readDb();
    const user = userFromToken(db, token);

    user.name = profile.name || user.name;
    user.profile = profile;
    user.targets = computeTargets(profile);
    user.onboarded = true;
    writeDb(db);

    return publicUser(user);
  },
};
