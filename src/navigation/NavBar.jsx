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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        shouldShowWhiteNav 
          ? "bg-white shadow-xl" 
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4 max-w-[70%] sm:max-w-none">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src={Logo} 
                alt="Logo" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-all duration-300"
              />
            </Link>
            <div className="block min-w-0">
              <p className={`text-[clamp(0.5rem,2vw,0.875rem)] font-semibold truncate transition-colors duration-300 ${
                shouldShowWhiteNav ? "text-black" : "text-white"
              }`}>
                Center for Lakes Sustainable Development
              </p>
              <p className={`text-[clamp(0.4rem,1.5vw,0.75rem)] truncate transition-colors duration-300 ${
                shouldShowWhiteNav ? "text-gray-700" : "text-gray-100"
              }`}>
                Research and Development
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.type === "link" ? (
                  <Link
                    to={item.path}
                    className={`px-2 lg:px-4 py-2 text-xs lg:text-sm font-semibold transition-all duration-300 relative group whitespace-nowrap ${
                      shouldShowWhiteNav ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </Link>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center px-2 lg:px-4 py-2 text-xs lg:text-sm font-semibold transition-all duration-300 relative group whitespace-nowrap ${
                        shouldShowWhiteNav ? "text-gray-700" : "text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`ml-1 h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-300 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                    </button>

                    <div
                      className={`absolute left-0 mt-3 w-56 lg:w-64 rounded-md bg-white shadow-2xl transition-all duration-300 origin-top-left ${
                        activeDropdown === index 
                          ? "opacity-100 scale-100 translate-y-0 visible" 
                          : "opacity-0 scale-95 -translate-y-2 invisible"
                      }`}
                    >
                      <div className="py-2 p-1" role="menu">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className="block px-4 py-2 text-xs lg:text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
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
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden z-[60]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isOpen 
                  ? "text-gray-800" // Color when menu is open
                  : (shouldShowWhiteNav ? "text-gray-700 hover:bg-blue-50" : "text-white hover:bg-white/10")
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR SECTION --- */}

      {/* 1. Backdrop Overlay (Exits menu when clicked) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenus}
        style={{ zIndex: 55 }}
      />

      {/* 2. Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-[58] md:hidden transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}
      >
        {/* Mobile Header (Logo and Close info) */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">CLSD</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Research Center</p>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Links */}
        <div className="pt-4 px-4 pb-20 h-full overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={index} className="mb-1">
              {item.type === "link" ? (
                <Link
                  to={item.path}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-semibold transition-all"
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      activeDropdown === index ? "text-blue-600 bg-blue-50/50" : "text-gray-700"
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;