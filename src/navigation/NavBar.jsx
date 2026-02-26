import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "../assets/logo/LSD.png";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const shouldShowWhiteNav = scrolled || !isHomePage;

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const navItems = [
    { label: "Home", path: "/", type: "link" },
    {
      label: "Research Units",
      type: "dropdown",
      items: [
        { label: "About Research Units", path: "/AboutResearchUnits" },
        { label: "Molecular Biology and Microbiology Laboratory", path: "/MBML" },
        { label: "Analytical Services Laboratory", path: "/AnalyticalServicesLab" },
        { label: "Food Innovation Laboratory", path: "/FoodInnovationLab" },
        { label: "Aquaculture Research Station", path: "/AquacultureResearchStation" },
        { label: "General Facilities", path: "/GeneralFacilities" },
        { label: "CLSD Equipment List", path: "/CLSDEquipmentList" },
      ],
    },
    {
      label: "Research and Development",
      type: "dropdown",
      items: [
        { label: "About Center for Lakes", path: "/AboutCenterForLakes" },
        { label: "Research Team", path: "/ResearchTeam" },
        { label: "CLSD Project", path: "/ClsdProject" },
        { label: "CLSD Research Paper", path: "/ClsdResearchPaper" },
        { label: "Philippine Lakes Database", path: "/PDL" },
      ],
    },
    {
      label: "Science and Research",
      type: "dropdown",
      items: [
        { label: "About Science and Research", path: "/AboutS&R" },
        { label: "DOST Funded Projects", path: "/DostFundedProject" },
      ],
    },
    {
      label: "Media",
      type: "dropdown",
      items: [
        { label: "Video Gallery", path: "/VideoGallery" },
        { label: "IEC Materials", path: "/IEC_Materials" },
      ],
    },
    { label: "Contact", path: "/Contact", type: "link" },
    { label: "E-Sentry", path: "/E-Sentry", type: "link" },
    { label: "Calendar", path: "/Calendar", type: "link" },
  ];

  return (
    <header
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        shouldShowWhiteNav ? "bg-white shadow-xl" : "bg-transparent py-2"
      }`}
    >
      {/* Full-width flex wrapper (no container padding) */}
      <div className="flex justify-between items-center h-16 sm:h-20 px-4 xl:px-8">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <img 
            src={Logo} 
            alt="Logo" 
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-all duration-300 flex-shrink-0"
          />
          <div className="flex flex-col">
            {/* Main title */}
            <p
              className={`text-xs sm:text-sm md:text-base lg:text-md xl:text-md font-normal leading-tight transition-colors duration-300 ${
                shouldShowWhiteNav ? "text-black" : "text-white"
              }`}
            >
              Center for Lakes Sustainable Development
            </p>

            {/* Subtitle */}
            <p
              className={`text-[9px] sm:text-sm md:text-sm lg:text-sm xl:text-sm transition-colors duration-300 ${
                shouldShowWhiteNav ? "text-gray-700" : "text-gray-100"
              }`}
            >
              Research and Development
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Right */}
        <nav className="hidden xl:flex xl:items-center xl:space-x-3 2xl:space-x-4">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              {item.type === "link" ? (
                <Link
                  to={item.path}
                  className={`relative px-2 2xl:px-3 py-2 text-sm font-semibold transition-all duration-300 group whitespace-nowrap inline-flex items-center ${
                    shouldShowWhiteNav ? "text-gray-700" : "text-white"
                  }`}
                  style={{ lineHeight: '1.5' }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`flex items-center px-2 2xl:px-3 py-2 text-sm font-semibold transition-all duration-300 relative group whitespace-nowrap ${
                      shouldShowWhiteNav ? "text-gray-700" : "text-white"
                    }`}
                    style={{ lineHeight: '1.5' }}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </button>

                  <div
                    className={`absolute left-0 mt-2 w-56 2xl:w-64 rounded-md bg-white shadow-2xl transition-all duration-300 origin-top-left ${
                      activeDropdown === index 
                        ? "opacity-100 scale-100 translate-y-0 visible" 
                        : "opacity-0 scale-95 -translate-y-2 invisible"
                    }`}
                  >
                    <div className="py-2" role="menu">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${shouldShowWhiteNav ? "text-gray-700" : "text-white"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${shouldShowWhiteNav ? "text-gray-700" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`xl:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenus}
      />

      {/* Side Drawer Menu */}
      <div
        className={`xl:hidden fixed top-0 right-0 h-screen w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="py-6 px-4 flex flex-col h-full">
          <header className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-10 w-auto flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-600 leading-tight">CLSD</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Research Center</p>
              </div>
            </div>
            <button 
              className="text-gray-600 hover:text-red-500 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          <nav className="flex flex-col space-y-1 py-4 overflow-y-auto flex-grow">
            {navItems.map((item, index) => (
              <div key={index} className="mb-1">
                {item.type === "link" ? (
                  <Link
                    to={item.path}
                    className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    onClick={closeMenus}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeDropdown === index ? "text-blue-600 bg-blue-50/50" : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} />
                    </button>
                    
                    <div className={`transition-all duration-300 overflow-hidden ${
                      activeDropdown === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="pl-6 space-y-1 mt-1 border-l-2 border-blue-100 ml-4 mb-2">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className="block text-gray-600 hover:text-blue-600 px-4 py-2.5 text-sm font-medium"
                            onClick={closeMenus}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;