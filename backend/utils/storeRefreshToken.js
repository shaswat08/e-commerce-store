import { redis } from "../lib/redis.js";

export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refreshToken:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.error("Error in the storeRefreshToken function: ", error.message);
  }
};
