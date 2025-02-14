import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListing from './components/ProductListing';
import AddProduct from './components/AddProduct';
import { ProductProvider } from './contexts/ProductConetxt';

function App() {
  return (
    <Router>
      <ProductProvider>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:index" element={<AddProduct />} />
      </Routes>
      </ProductProvider>
    </Router>
  );
}

export default App;