import express from "express";
import { createCheckoutSession, successCheckout } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/success", protectRoute, successCheckout)

export default router;
