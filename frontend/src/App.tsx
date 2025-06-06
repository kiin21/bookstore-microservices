import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import CartPage from "./components/pages/Cart";


const Orders = () => <div>📦 Orders Page</div>;

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<Orders />} />
            </Route>
        </Routes>
    );
}

export default App;