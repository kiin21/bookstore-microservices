import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Navigation />
            <main className="flex-1 w-full bg-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;