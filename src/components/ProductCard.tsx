import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  image: string;
  productName: string;
  description: string;
  price: string;
  sku: string;
  productType: "DVD" | "Book" | "Furniture";
  productSpecificValue: string;
  isSelected: boolean;
  createdAt: string;
  onSelect: () => void;
}

const productTypes = (str: string) => ({
  DVD: `Size: ${str} MB`,
  Book: `Weight: ${str} Kg`,
  Furniture: `Dimensions: ${str}`,
});

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  productName,
  price,
  sku,
  productType,
  productSpecificValue,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`border rounded-3xl p-4 text-gray-600 ${
        isSelected ? "border-orange-400" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="absolute opacity-0 w-0 h-0"
        />
        <span
          className={`mb-2 w-6 h-6 absolute top-3 left-3 rounded-full border-2 border-white ${
            isSelected ? "bg-orange-400" : " bg-gray-600/60"
          }`}
        ></span>
      </div>
      <img
        src={image}
        className="w-full h-48 object-cover rounded-xl"
        alt={productName}
      />
      <div className="flex flex-col gap-3 p-4 items-start">
      <Link to={`/product-details/${sku}/${encodeURIComponent(image)}`}>
          <h3 className="text-lg text-amber-600 font-bold">{productName}</h3>
        </Link>   
               {/* <p className="text-gray-600">{description}</p> */}
        <p className="text-xl font-semibold">{price}</p>
        <p className="text-sm text-gray-500">{sku}</p>
        <p className="text-sm text-gray-500">
          {productTypes(productSpecificValue)[productType]}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
