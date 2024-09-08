import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const cartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.cartItems.push({ quantity: 1, product: productId });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Item added to the cart", cart: user.cartItems });
  } catch (error) {
    console.error("Error in the addToCart controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();

    res.status(200).json({
      message: "Removed items from the cart successfully",
      cart: user.cartItems,
    });
  } catch (error) {
    console.error("Error in the removeAllFromCart controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { quantity } = req.body;

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === id
    );

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems.filter((item) => item.product.toString() !== id);
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in the updateQuantity controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    const productId = user.cartItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productId } });

    const cartItems = products.map((product) => {
      const items = user.cartItems.find(
        (item) => item.product.toString() === product._id.toString()
      );
      return { ...product.toJSON(), quantity: items.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error in the getCartProducts controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
