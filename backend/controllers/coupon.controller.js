import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const user = req.user;
    const coupon = await Coupon.findOne({ userId: user._id, isActie: true });
    res.json(coupon || null);
  } catch (error) {
    console.error("Error in the getCoupon controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error in the validateCoupon controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
