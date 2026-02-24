import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Menu button for mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* Links */}
          <div className={`hidden md:flex space-x-4`}>
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">
              Home
            </Link>
            <Link to="/about" className="hover:bg-gray-700 px-3 py-2 rounded">
              About
            </Link>
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">
              Contact
            </Link>
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">
              Contact
            </Link>
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">
              Contact
            </Link>            
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">
              Contact
            </Link>            
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">
              Home
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded hover:bg-gray-700">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 rounded hover:bg-gray-700">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;