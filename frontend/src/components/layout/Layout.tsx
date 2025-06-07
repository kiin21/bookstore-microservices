import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
                <div className="container mx-auto">
                    <p>© {new Date().getFullYear()} BookStore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;