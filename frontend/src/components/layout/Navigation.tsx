import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
    name: string;
    path: string;
}

const navLinks: NavLink[] = [
    { name: "Cart", path: "/cart" },
    { name: "Orders", path: "/orders" },
];

const Navigation: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="bg-gray-800 text-white shadow-md w-full">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/images/books.png" alt="Books Logo" width="40" height="40" className="mr-2" />
                    <span className="text-xl font-bold">BookStore</span>
                </Link>
                <ul className="flex space-x-6">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`hover:underline ${location.pathname === link.path ? "text-yellow-400" : ""}`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;