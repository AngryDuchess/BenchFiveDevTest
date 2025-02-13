import React from 'react';

interface ProductCardProps {
  image: string;
  productName: string;
  description: string;
  price: string;
  sku: string;
  productType: 'DVD' | 'Book' | 'Furniture';
  productSpecificValue: string;
  isSelected: boolean;
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, productName, description, price, sku, productType, productSpecificValue, isSelected, onSelect }) => {
  const renderProductSpecificValue = () => {
    switch (productType) {
      case 'DVD':
        return `Size: ${productSpecificValue} MB`;
      case 'Book':
        return `Weight: ${productSpecificValue} Kg`;
      case 'Furniture':
        return `Dimensions: ${productSpecificValue}`;
      default:
        return null;
    }
  };

  return (
    <div
      className={`border rounded-3xl p-4 text-gray-600 ${isSelected ? 'border-orange-400' : 'border-gray-200'}`}
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
          className={`mb-2 w-6 h-6 absolute top-3 left-3 rounded-full border-2 border-white ${isSelected ? 'bg-orange-400' : ' bg-gray-600/60'}`}
        ></span>
      </div>
      <img src={image} className="w-full h-48 object-cover rounded-lg" alt={productName} />
      <div className="flex flex-col gap-3 p-4 items-start">
        <h3 className="text-lg font-bold">{productName}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-xl font-semibold">{price}</p>
        <p className="text-sm text-gray-500">{sku}</p>
        <p className="text-sm text-gray-500">{renderProductSpecificValue()}</p>
      </div>
    </div>
  );
};

export default ProductCard;