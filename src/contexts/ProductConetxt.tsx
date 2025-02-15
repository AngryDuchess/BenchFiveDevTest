import React, { createContext, useState, useContext, ReactNode } from "react";
import { Product } from "../types/products";

interface ProductContextProps {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (index: number, product: Product) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, product];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const updateProduct = (index: number, product: Product) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = product;
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};