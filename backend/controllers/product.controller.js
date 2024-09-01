export const getAllProducts = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in the getAllProducts controller: ", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
