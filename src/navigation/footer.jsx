import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (<footer className="bg-gray-800 text-white py-4">
    <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
      <p>&copy; 2026 CLSD. All rights reserved.</p>

      <div className="flex gap-6">
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;