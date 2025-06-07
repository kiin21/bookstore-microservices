import { Link } from "react-router-dom";
import { userService } from "../../services";

const Navigation = () => {
    const isAuthenticated = userService.isLoggedIn();

    return (
        <nav className="bg-gray-800 text-white shadow-md w-full fixed top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/images/books.png" alt="Books Logo" width="40" height="40" className="mr-2" />
                    <span className="text-xl font-bold">BookStore</span>
                </Link>
                <div className="flex items-center space-x-6">
                    {isAuthenticated && (
                        <Link to="/orders"> Orders </Link>
                    )}
                    <Link to="/cart"> Cart </Link>
                    {isAuthenticated ? (
                        <Link to="/logout"> Logout </Link>
                    ) : (
                        <Link to="/login"> Login </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;