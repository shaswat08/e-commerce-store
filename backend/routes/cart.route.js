import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, addToCart);
router.put("/update/:id", protectRoute, updateQuantity);
router.delete("/remove", protectRoute, removeAllFromCart);
router.get("/all", protectRoute, getCartProducts);

export default router;
