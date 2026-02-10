import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
// import NewsPage from "./pages/NewsPage";
// import OrdersPage from "./pages/OrdersPage";
// import PartnersPage from "./pages/PartnersPage";
// import PagesPage from "./pages/PagesPage";
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
