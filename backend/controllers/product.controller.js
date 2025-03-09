import moongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error getting products", error);
    return res
      .status(500)
      .json({ message: "Error getting products", success: false });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  const newProduct = new Product(product);

  try {
    await Product.create(product);
    return res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", success: false });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const product = req.body;

  if (!moongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid product id", success: false });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log("Error updating product", error);
    return res
      .status(500)
      .json({ message: "Error updating product", success: false });
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    return res.status(200).json({ message: "Product deleted", success: true });
  } catch (error) {
    console.log("Error deleting product", error);
    return res
      .status(500)
      .json({ message: "Error deleting product", success: false });
  }
};
