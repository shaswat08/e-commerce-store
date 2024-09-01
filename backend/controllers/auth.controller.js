import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  generateToken,
  setCookies,
} from "../utils/generateTokenAndSetCookie.js";
import { storeRefreshToken } from "../utils/storeRefreshToken.js";

//signup controller

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; //destructuring the request body

    const userExists = await User.findOne({ email }); //check if user exists

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const emailValid = emailRegex.test(email); //check if email is valid

    if (!emailValid) {
      return res.status(400).json({ error: "Invalid Email provided" });
    }

    const user = await User.create({ name, email, password }); //create a new user

    //authenticate user

    const { accessToken, refreshToken } = generateToken(user._id);

    //store refresh token in redis

    await storeRefreshToken(user._id, refreshToken);

    //set cookies

    setCookies(res, accessToken, refreshToken);

    //send response

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in the signup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: `Welcome ${user.name}` });
  } catch (error) {
    console.log();
    res.status(500).json();
  }
};

//logout controller
export const logout = async (req, res) => {
  try {
    //remove refresh token from redis

    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      return res.status(400).json({ error: "No active session found" });
    }

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refreshToken:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in the logout controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
