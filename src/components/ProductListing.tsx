import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Link, useNavigate } from "react-router-dom";
import gif from "../assets/loading.gif";
import { Product } from "../types/products";

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    storedProducts.sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setProducts(storedProducts);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedProduct(id === selectedProduct ? null : id);
  };

  const handleEdit = () => {
    if (selectedProduct !== null) {
      console.log(`You are editing: ${selectedProduct}`)
      navigate(`/edit-product/${selectedProduct}`);
      setSelectedProduct(null)
    }
  };

  const handleDelete = () => {
    if (selectedProduct !== null) {
      const updatedProducts = products.filter(
        (p) => p.id !== selectedProduct
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setSelectedProduct(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <header className="flex justify-between py-3">
        <p className="text-2xl lg:text-5xl font-semibold">Product List</p>
        <div className="flex gap-2 items-center">
          {selectedProduct ? (
            <>
              <button
                onClick={handleEdit}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-xl"
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
            <Link to="/new-product">
              <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-xl ">
                Add
              </button>
            </Link>
          )}
        </div>
      </header>
      <hr />
      {products.length === 0 ? (
        <div className="flex flex-col gap-3 mt-10 text-center font-sm justify-center items-center h-64">
          <img src={gif} className="w-52 h-auto" alt="Waiting..." />
          <p>You should probably start adding products now!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {currentProducts.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                productName={product.productName}
                description={product.description}
                price={product.price}
                sku={product.sku}
                productType={product.productType}
                productSpecificValue={product.productSpecificValue}
                createdAt={product.createdAt}
                isSelected={selectedProduct === product.id}
                onSelect={() =>{ 
                  console.log(index)
                  handleSelect(product.id)}}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            {Array.from(
              { length: Math.ceil(products.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-amber-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </>
  );
}
