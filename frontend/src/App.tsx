// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";


// Dummy pages
// const Home = () => <div>🏠 Home Page</div>;
const Products = () => <div>📚 Products Page</div>;
const Cart = () => <div>🛒 Cart Page</div>;
const Orders = () => <div>📦 Orders Page</div>;

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<Orders />} />
            </Route>
        </Routes>
    );
}

export default App;
