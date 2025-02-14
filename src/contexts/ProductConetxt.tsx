import { Product } from "../types/products";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type ProductContextType = {
    products: Product[];
    selectedProductIndex: number | null;
    handleSelect: (index: number) => void;
    handleEdit: () => void;
    handleDelete: () => void;
  };

const ProductContext = createContext<ProductContextType | undefined>(undefined);


export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    const navigate = useNavigate();
  
    // Load products from localStorage on mount
    useEffect(() => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    }, []);
  
    // Handle product selection
    const handleSelect = useCallback((index: number) => {
      setSelectedProductIndex((prevIndex) => (prevIndex === index ? null : index));
    }, []);
  
    // Handle product edit
    const handleEdit = useCallback(() => {
      if (selectedProductIndex !== null) {
        navigate(`/edit-product/${selectedProductIndex}`);
      }
    }, [selectedProductIndex, navigate]);
  
    // Handle product deletion
    const handleDelete = useCallback(() => {
      if (selectedProductIndex !== null) {
        const updatedProducts = products.filter((_, index) => index !== selectedProductIndex);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setSelectedProductIndex(null);
      }
    }, [selectedProductIndex, products]);
  
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
      products,
      selectedProductIndex,
      handleSelect,
      handleEdit,
      handleDelete,
    }), [products, selectedProductIndex, handleSelect, handleEdit, handleDelete]);
  
    return (
      <ProductContext.Provider value={contextValue}>
        {children}
      </ProductContext.Provider>
    );
  };


  export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
      throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
  };