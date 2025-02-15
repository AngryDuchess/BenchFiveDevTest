import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../types/products";
import {Spinner, WarningIcon} from "./spinner";

const AddProduct: React.FC = () => {
  const { index } = useParams<{ index?: string }>();
  const [product, setProduct] = useState<Product>({
    image: "",
    price: "",
    sku: "",
    description: "",
    productName: "",
    productType: "DVD",
    productSpecificValue: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [productSpecificValue, setProductSpecificValue] = useState("");
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    length: "",
  });
  const [isProductNameMissing, setIsProductNameMissing] = useState(false);
  const [isProductPriceMissing, setIsProductPriceMissing] = useState(false);
  const [isProductSpecsMissing, setIsProductSpecsMissing] = useState(false);
  const [isProductImageMissing, setIsProductImageMissing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    if (index !== undefined) {
      const storedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      const existingProduct = storedProducts[parseInt(index)];
      if (existingProduct) {
        setProduct({
          ...existingProduct,
        });
        if (existingProduct.productType === "Furniture") {
          const [height, width, length] =
            existingProduct.productSpecificValue.split(" x ");
          setDimensions({ height, width, length });
        } else {
          setProductSpecificValue(existingProduct.productSpecificValue);
          setProduct({ ...existingProduct, productSpecificValue });
        }
      }
    }
  }, [index]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (
        !product.sku ||
        !product.productName ||
        !product.price ||
        !product.image ||
        (product.productType === "Furniture" &&
          (!dimensions.height || !dimensions.width || !dimensions.length)) ||
        (product.productType !== "Furniture" && !product.productSpecificValue)
      ) {
        setErrorMessage("Please, submit required data");
        setIsProductNameMissing(!product.productName);   
        setIsProductPriceMissing(!product.price);
        setIsProductSpecsMissing(!product.productSpecificValue);
        setIsProductImageMissing(!product.image)
        setSubmitting(false);
        return;
      }
    try {
      setSubmitting(true);
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dn5ks1ljf/upload",
          formData
        );
        if (res.data.secure_url) {
          setProduct({ ...product, image: res.data.secure_url as string });
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
      localStorage.setItem("products", JSON.stringify(existingProducts));
      navigate("/");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

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
            {submitting && <Spinner />}
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
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <form className="space-y-4 max-w-sm mt-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product name
          </label>
          <input
            type="text"
            value={product.productName}
            required
            onChange={(e) =>
              setProduct({ ...product, productName: e.target.value })
            }
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
          {isProductNameMissing && (
            <span className="flex gap-1 items-center mt-3">
                <WarningIcon />
            <p className="text-red-500 text-xs">
              Please provide product name
            </p>
            </span>
          )}
          
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product price
          </label>
          <input
            type="text"
            value={product.price}
            required
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
          {isProductPriceMissing && (
            <span className="flex gap-1 items-center mt-3">
                <WarningIcon />
            <p className="text-red-500 text-xs">
              Please provide a price
            </p>
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload product image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            required
            onChange={handleImageChange}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
          {isProductImageMissing && (
            <span className="flex gap-1 items-center mt-3">
                <WarningIcon />
            <p className="text-red-500 text-xs">
              Please provide an image
            </p>
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Type
          </label>
          <select
            value={product.productType}
            onChange={(e) =>
              setProduct({
                ...product,
                productType: e.target.value as "DVD" | "Book" | "Furniture",
              })
            }
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
              Please, provide dimensions
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Height"
                value={dimensions.height}
                required
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                placeholder="Width"
                value={dimensions.width}
                required
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                placeholder="Length"
                value={dimensions.length}
                required
                onChange={(e) =>
                  setDimensions({ ...dimensions, length: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            {isProductSpecsMissing && (
            <span className="flex gap-1 items-center mt-3">
                <WarningIcon />
            <p className="text-red-500 text-xs">
              Please provide product specifications
            </p>
            </span>
          )}
          </div>
          
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {product.productType === "DVD"
                ? "Please, provide size size (MB)"
                : "Please, provide size weight (Kg)"}
            </label>
            <input
              type="number"
              value={product.productSpecificValue}
              required
              onChange={(e) =>
                setProduct({ ...product, productSpecificValue: e.target.value })
              }
              className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
            />
            {isProductSpecsMissing && (
            <span className="flex gap-1 items-center mt-3">
                <WarningIcon />
            <p className="text-red-500 text-xs">
              Please provide product specifications
            </p>
            </span>
          )}
          </div>
        )}
      </form>
    </>
  );
};

export default AddProduct;
