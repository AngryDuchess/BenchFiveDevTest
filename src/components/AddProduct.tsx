import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddProduct: React.FC = () => {
  const { index } = useParams<{ index?: string }>();
  const navigate = useNavigate();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [productType, setProductType] = useState<'DVD' | 'Book' | 'Furniture'>('DVD');
  const [productSpecificValue, setProductSpecificValue] = useState('');
  const [dimensions, setDimensions] = useState({ height: '', width: '', length: '' });

  useEffect(() => {
    if (index !== undefined) {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const product = storedProducts[parseInt(index)];
      if (product) {
        setSku(product.sku);
        setName(product.productName);
        setPrice(product.price);
        setImage(product.image);
        setProductType(product.productType);
        if (product.productType === 'Furniture') {
          const [height, width, length] = product.productSpecificValue.split(' x ');
          setDimensions({ height, width, length });
        } else {
          setProductSpecificValue(product.productSpecificValue);
        }
      }
    }
  }, [index]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSave = () => {
    const newProduct = {
      sku,
      productName: name,
      price,
      image,
      productType,
      productSpecificValue: productType === 'Furniture' ? `${dimensions.height} x ${dimensions.width} x ${dimensions.length}` : productSpecificValue,
    };

    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (index !== undefined) {
      existingProducts[parseInt(index)] = newProduct;
    } else {
      existingProducts.push(newProduct);
    }
    localStorage.setItem('products', JSON.stringify(existingProducts));

    navigate('/');
  };

  return (
    <>
    <Link to="/">
          <button className="text-gray-800 py-2 px-4 hover:text-blue-600">
            ← Go back
          </button>
        </Link>
      <header className="flex  gap-8 py-3 justify-between">
        
        <h1 className="text-3xl font-semibold">{index !== undefined ? 'Edit Product' : 'Add a Product'}</h1>
        <div className='flex gap-3'>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded "
        >
          {index !== undefined ? 'Update Product' : 'Save Product'}
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
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
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
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as 'DVD' | 'Book' | 'Furniture')}
            className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="DVD">DVD</option>
            <option value="Book">Book</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>
        {productType === 'Furniture' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Dimensions (H x W x L)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Height"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                placeholder="Width"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                placeholder="Length"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {productType === 'DVD' ? 'Size (MB)' : 'Weight (Kg)'}
            </label>
            <input
              type="text"
              value={productSpecificValue}
              onChange={(e) => setProductSpecificValue(e.target.value)}
              className="mt-1 block w-full h-11 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
      </form>
    </>
  );
};

export default AddProduct;