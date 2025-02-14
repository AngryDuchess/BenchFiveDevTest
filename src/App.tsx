import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListing from './components/ProductListing';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:index" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;