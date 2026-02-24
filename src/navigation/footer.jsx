import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (<footer className="bg-gray-800 text-white py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2024 My Website. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer;