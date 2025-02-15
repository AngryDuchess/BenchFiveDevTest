import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListing from './components/ProductListing';
import AddProduct from './components/AddProduct';
import { ProductProvider } from './contexts/ProductConetxt';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <Router>
      <ProductProvider>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/new-product" element={<AddProduct />} />
        <Route path="/edit-product/:index" element={<AddProduct />} />
        <Route path="/product-details/:sku/:image" element={<ProductDetails />} />
      </Routes>
      </ProductProvider>
    </Router>
  );
}

export default App;