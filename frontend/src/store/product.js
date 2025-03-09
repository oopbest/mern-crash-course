import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (product) => {
    if (!product.name || !product.price || !product.image) {
      return { success: false, message: "All fields are required" };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (res.ok) {
      set((state) => ({ products: [...state.products, data] }));
      return { success: true, message: "Product created successfully" };
    }
    return { success: false, message: data.message };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const products = await res.json();
    set({ products: products.data });
  },
  deleteProduct: async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      // update the ui immediately, without needing to refresh the page
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));
      return { success: true, message: "Product deleted successfully" };
    }
    return { success: false, message: data.message };
  },
  updateProduct: async (id, product) => {
    if (!product.name || !product.price || !product.image) {
      return { success: false, message: "All fields are required" };
    }
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (res.ok) {
      // update the ui immediately, without needing to refresh the page
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, ...product } : p
        ),
      }));
      return { success: true, message: "Product updated successfully" };
    }
    return { success: false, message: data.message };
  },
}));
