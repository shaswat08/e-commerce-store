import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.json({ products });
  } catch (error) {
    console.error("Error in the getAllProducts controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    //store in redis

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch {
    console.error(
      "Error in the getFeaturedProducts controller: ",
      error.message
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch {
    console.error("Error in the createProduct controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({ dsfds });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.error("Error deleting image from cloudinary: ", error.message);
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch {
    console.error("Error in the deleteProduct controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
