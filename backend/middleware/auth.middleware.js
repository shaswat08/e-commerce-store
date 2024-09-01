import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: "Token not found" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(403).json({ message: "User not found or forbidden" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in the protectRoute middleware: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  try {
    if (req?.user?.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }
  } catch (error) {
    console.error("Error in the adminRoute middleware: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
