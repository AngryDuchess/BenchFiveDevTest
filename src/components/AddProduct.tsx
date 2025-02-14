import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {Product} from '../types/products'
import Spinner from "./spinner";

const AddProduct: React.FC = () => {
  const { index } = useParams<{ index?: string }>();
  const [product, setProduct] = useState<Product>({
    image: "",
    price: "",
    sku: "",
    description: "",
    productName: "",
    productType: "DVD",
    productSpecificValue: ""
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const navigate = useNavigate();
  const [productSpecificValue, setProductSpecificValue] = useState("");
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    length: "",
  });

  useEffect(() => {
    if (index !== undefined) {
      const storedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      const existingProduct = storedProducts[parseInt(index)];
      if (existingProduct) {
        setProduct({
          ...existingProduct
        })
        if (existingProduct.productType === "Furniture") {
          const [height, width, length] =
          existingProduct.productSpecificValue.split(" x ");
          setDimensions({ height, width, length });
        } else {  
          setProductSpecificValue(existingProduct.productSpecificValue);
          setProduct({...existingProduct, productSpecificValue})
        }
      }
    }
  }, [index]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
        setImageFile(file)
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true)
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default");
        const res = await axios.post('https://api.cloudinary.com/v1_1/dn5ks1ljf/upload', formData)
          if (res.data.secure_url) {
            setProduct({...product, image: res.data.secure_url as string})
          }
        }
      const newProduct = {
        ...product,
        productSpecificValue:
          product.productType === "Furniture"
            ? `${dimensions.height} x ${dimensions.width} x ${dimensions.length}`
            : product.productSpecificValue,
      };
  
      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      if (index !== undefined) {
        existingProducts[parseInt(index)] = newProduct;
      } else {
        existingProducts.push(newProduct);
      }
      localStorage.setItem("products", JSON.stringify(
        existingProducts
      ));
      navigate("/");
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  };

  console.log(product);
  return (
    <>
      <Link to="/">
        <button className="text-gray-800 py-2 px-4 hover:text-blue-600">
          ← Go back
        </button>
      </Link>
      <header className="flex flex-col lg:flex-row gap-8 py-3 justify-between">
      <p className="text-2xl lg:text-5xl font-semibold">
          {index !== undefined ? "Edit Product" : "Add a Product"}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            {submitting && (
              <Spinner />
            )}
            {index !== undefined ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="mt-4  hover:text-red-600 text-gray-500 py-2 px-4  "
          >
            Cancel
          </button>
        </div>
      </header>
      <hr />
      <form className="space-y-4 max-w-sm mt-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={product.sku}
            onChange={(e) => setProduct({...product, sku: e.target.value})}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={product.productName}
            onChange={(e) => setProduct({...product, productName: e.target.value})}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="text"
            value={product.price}
            onChange={(e) => setProduct({...product, price: e.target.value})}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Type
          </label>
          <select
            value={product.productType}
            onChange={(e) => setProduct({...product, productType: e.target.value as "DVD" | "Book" | "Furniture"})}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="DVD">DVD</option>
            <option value="Book">Book</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>
        {product.productType === "Furniture" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimensions (H x W x L)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Height"
                value={dimensions.height}
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                placeholder="Width"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                placeholder="Length"
                value={dimensions.length}
                onChange={(e) =>
                  setDimensions({ ...dimensions, length: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {product.productType === "DVD" ? "Size (MB)" : "Weight (Kg)"}
            </label>
            <input
              type="text"
              value={product.productSpecificValue}
            onChange={(e) => setProduct({...product, productSpecificValue: e.target.value})}
              className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
      </form>
    </>
  );
};

export default AddProduct;
