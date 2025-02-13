import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { products } from '../misc.data';

export default function ProductListing() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleSelect = (index: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  return (
    <>
      <header className="flex justify-between py-3 ">
        <h1 className="text-3xl font-semibold">Product List</h1>
        <div className="flex gap-2">
          <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add
          </button>
          <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Mass Delete
          </button>
        </div>
      </header>
      <hr />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            image={product.image}
            productName={product.productName}
            description={product.description}
            price={product.price}
            sku={product.sku}
            productType={product.productType}
            productSpecificValue={product.productSpecificValue}
            isSelected={selectedProducts.includes(index)}
            onSelect={() => handleSelect(index)}
          />
        ))}
      </div>
    </>
  );
}