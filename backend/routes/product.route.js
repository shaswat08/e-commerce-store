import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/create", protectRoute, adminRoute, createProduct);
router.delete("/delete/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/toggle/:id", protectRoute, adminRoute, toggleFeaturedProduct)

export default router;
