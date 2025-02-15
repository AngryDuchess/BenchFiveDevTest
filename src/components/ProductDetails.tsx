import React from "react";
import { Link, useParams } from "react-router-dom";

const ProductDetails: React.FC = () => {
  const { image } = useParams<{ sku: string; image: string }>();

  return (
    <div className="container mx-auto p-4">
      <Link to="/">
        <button className="text-gray-800 py-2 px-4 hover:text-blue-600">
          ← Go back
        </button>
      </Link>
      <h1 className="text-3xl font-bold mb-5">Product Details</h1>
      <div className="flex flex-col">
        <img
          src={image}
          alt="Product"
          className="w-full h-auto max-w-md rounded-xl"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
