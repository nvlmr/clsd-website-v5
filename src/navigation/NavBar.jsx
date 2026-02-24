import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "../assets/logo/LSD.png";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
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
        { label: "PDL", path: "/PDL" },
      ],
    },
    {
      label: "Science and Research",
      type: "dropdown",
      items: [
        { label: "About Science and Research", path: "/sr1" },
        { label: "DOST Funded Projects", path: "/sr2" },
      ],
    },
    {
      label: "Media",
      type: "dropdown",
      items: [
        { label: "Video Gallery", path: "/media1" },
        { label: "IEC Materials", path: "/media2" },
      ],
    },
    { label: "Contact", path: "/contact", type: "link" },
    { label: "E-Sentry", path: "/esentry", type: "link" },
    { label: "Calendar", path: "/calendar", type: "link" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-xl" : "bg-white"
      } border-b border-gray-300 shadow-lg`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-12 w-auto object-contain" />
            </Link>
            <div>
              <p className="text-sm text-black font-semibold">Center for Lakes Sustainable Development</p>
              <p className="text-xs text-gray-700">Research and Development</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.type === "link" ? (
                  <Link
                    to={item.path}
                    className="text-gray-700 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:text-gray-700 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </Link>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 relative group ${
                        activeDropdown === index 
                        ? "text-gray-700" 
                        : "text-gray-700"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                    </button>

                    {/* Animated Dropdown Menu */}
                    <div
                      className={`absolute left-0 mt-3 w-64 rounded-xl bg-white shadow-2xl transition-all duration-300 origin-top-left ${
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
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.type === "link" ? (
                <Link
                  to={item.path}
                  className="block text-gray-700 hover:text-gray-700 px-3 py-3 rounded-lg text-base font-semibold transition-all relative group"
                  onClick={closeMenus}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
              ) : (
                <div className="py-1">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-base font-semibold transition-all relative group ${
                      activeDropdown === index ? "text-gray-700" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} />
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      activeDropdown === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-6 space-y-1 mt-1 border-l-2 border-blue-100 ml-3">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium rounded-md"
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