import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../types/products";
import { Spinner, WarningIcon } from "./spinner";
import {nanoid } from 'nanoid'

const AddProduct: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Product>({
    id: nanoid(),
    image: "",
    price: "",
    sku: "",
    description: "",
    productName: "",
    productType: "DVD",
    productSpecificValue: "",
    createdAt: new Date().toISOString(),
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(id === undefined)
  const navigate = useNavigate();
  const [, setProductSpecificValue] = useState("");
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    length: "",
  });
  const [isProductNameMissing, setIsProductNameMissing] = useState(false);
  const [isProductPriceMissing, setIsProductPriceMissing] = useState(false);
  const [isProductSpecsMissing, setIsProductSpecsMissing] = useState(false);
  const [isImageMissing, setIsImageMissing] = useState(false);
  const [, setIsProductSKUMissing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id !== undefined) {
      const storedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      const existingProduct = storedProducts.find((prod: Product) => prod.id === id);
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
        }
      }
    }
  }, [id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsImageMissing(false);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    setErrorMessage("");

    if (
      !product.sku ||
      !product.productName ||
      !product.price ||
      (!imageFile && !id && showImageUpload) ||
      (product.productType === "Furniture" &&
        (!dimensions.height || !dimensions.width || !dimensions.length)) ||
      (product.productType !== "Furniture" && !product.productSpecificValue)
    ) {
      setErrorMessage("Please, submit required data");
      setIsProductSKUMissing(!product.sku);
      setIsProductNameMissing(!product.productName);
      setIsProductPriceMissing(!product.price);
      setIsProductSpecsMissing(!product.productSpecificValue);
      setIsImageMissing(!product.image && !imageFile);
      setSubmitting(false);
      return;
    }

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const isDuplicateSKU: boolean = products.some(
      (existingProduct: Product) =>
        existingProduct.sku === product.sku &&
        (id === undefined || existingProduct.id !== id)
    );

    if (isDuplicateSKU) {
      setErrorMessage("SKU must be unique");
      setIsProductSKUMissing(true);
      setSubmitting(false);
      return;
    }

    try {
      let imageUrl = product.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dn5ks1ljf/upload",
          formData
        );

        if (res.data.secure_url) {
          imageUrl = res.data.secure_url;
        } else {
          throw new Error("Image upload failed.");
        }
      }

      const newProduct = {
        ...product,
        image: imageUrl,
        productSpecificValue:
          product.productType === "Furniture"
            ? `${dimensions.height} x ${dimensions.width} x ${dimensions.length}`
            : product.productSpecificValue,
        createdAt: product.createdAt || new Date().toISOString(),
      };

      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      if (id) {
   const updatedProducts = existingProducts.map((p: Product) => {
    
    if (p.id === id) {
      return {
        ...product, image: imageUrl,
      };
    }
    return p;
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts));

      } else {
        existingProducts.push(newProduct);
        localStorage.setItem("products", JSON.stringify(existingProducts));
      }
      navigate("/");
    } catch (e) {
      console.error(e);
      setErrorMessage("An error occurred while saving the product.");
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
          {id !== undefined ? "Edit Product" : "Add a Product"}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-amber-600 hover:bg-amber-700 focus text-white py-2 px-4 rounded flex items-center gap-2"
          >
            {submitting && <Spinner />}
            {id !== undefined ? "Update" : "Save"}
          </button>
          <Link to="/">
            <button
              type="button"
              className="mt-4  hover:text-red-600 text-gray-500 py-2 px-4  "
            >
              Cancel
            </button>
          </Link>
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
            required
            onChange={(e) => {
              setProduct({ ...product, sku: e.target.value });
              setIsProductSKUMissing(false);
            }}
            className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
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
            onChange={(e) => {
              setProduct({ ...product, productName: e.target.value });
              setIsProductNameMissing(false);
            }}
            className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
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
            onChange={(e) => {
              setProduct({ ...product, price: e.target.value });
              setIsProductPriceMissing(false);
            }}
            className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
          />
          {isProductPriceMissing && (
            <span className="flex gap-1 items-center mt-3">
              <WarningIcon />
              <p className="text-red-500 text-xs">Please provide a price</p>
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload product image
          </label>
          {showImageUpload && <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            required
            onChange={handleImageChange}
            className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
          />}
          {product.image && !showImageUpload && (
            <div className={"max-w-[40px] rounded-xl flex gap-x-4 items center mt-5"}>
              <img className="rounded" src={product.image} alt={'product uimage'} />
              <button className="border border-amber-600 px-4 text-amber-600 rounded"
                onClick={() => setShowImageUpload(true)}
              >Change</button>
            </div>
          )}
          {isImageMissing && (
            <span className="flex gap-1 items-center mt-3">
              <WarningIcon />
              <p className="text-red-500 text-xs">Image is missing</p>
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
            className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
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
                onChange={(e) => {
                  setDimensions({ ...dimensions, height: e.target.value });
                  setIsProductSpecsMissing(false);
                }}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Width"
                value={dimensions.width}
                required
                onChange={(e) => {
                  setDimensions({ ...dimensions, width: e.target.value });
                  setIsProductSpecsMissing(false);
                }}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md "
              />
              <input
                type="number"
                placeholder="Length"
                value={dimensions.length}
                required
                onChange={(e) => {
                  setDimensions({ ...dimensions, length: e.target.value });
                  setIsProductSpecsMissing(false);
                }}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md "
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
                ? "Please, provide size (MB)"
                : "Please, provide weight (Kg)"}
            </label>
            <input
              type="number"
              value={product.productSpecificValue}
              required
              onChange={(e) => {
                setProduct({
                  ...product,
                  productSpecificValue: e.target.value,
                });
                setIsProductSpecsMissing(false);
              }}
              className="mt-1 p-3 block w-full h-11 border border-gray-300 rounded-md "
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
