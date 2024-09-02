import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/create", protectRoute, adminRoute, createProduct); 
router.delete("/delete", protectRoute, adminRoute, deleteProduct); 

export default router;
