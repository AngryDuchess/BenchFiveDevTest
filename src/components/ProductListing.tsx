import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
// import { products } from "../misc.data";
import { Link, useNavigate } from "react-router-dom";

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

 const handleSelect = (index: number) => {
    setSelectedProductIndex(index === selectedProductIndex ? null : index);
  };

  const handleEdit = () => {
    if (selectedProductIndex !== null) {
      navigate(`/edit-product/${selectedProductIndex}`);
    }
  };

  const handleDelete = () => {
    if (selectedProductIndex !== null) {
      const updatedProducts = products.filter((_, index) => index !== selectedProductIndex);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setSelectedProductIndex(null);
    }
  };

  return (
    <>
      <header className="flex justify-between py-3">
        <h1 className="text-3xl font-semibold">Product List</h1>
        <div className="flex gap-2 items-center">
          {selectedProductIndex !== null ? (
            <>
              <button
                onClick={handleEdit}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="= text-gray-500 py-2 px-4 rounded hover:text-red-600"
              >
                Delete
              </button>
            </>
          ) : (
            <Link to="/add-product">
              <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded ">
                Add
              </button>
            </Link>
          )}
        </div>
      </header>
      <hr />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
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
            isSelected={selectedProductIndex === index}
            onSelect={() => handleSelect(index)}
          />
        ))}
      </div>
    </>
  );
}
