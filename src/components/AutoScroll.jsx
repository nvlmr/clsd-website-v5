import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const AutoScroll = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-[calc(6rem+8px)] right-6 
        bg-blue-500 hover:bg-blue-600 text-white 
        p-4 rounded-full shadow-lg 
        transition-all duration-300 ease-in-out
        transform focus:outline-none focus:ring-2 
        focus:ring-blue-400 focus:ring-offset-2 z-40
        ${showButton 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default AutoScroll;