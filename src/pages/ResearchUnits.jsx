import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MolecularLab from "../assets/images/About Research Units/Molecular Lab.jpg";
import AnalyticalLab from "../assets/images/About Research Units/Analytical Lab.jpg";
import AquacultureStation from "../assets/images/About Research Units/Aquaculture Station.jpg";
import GeneralFacility from "../assets/images/About Research Units/General Facility Station.jpg";
import FoodInnovation from "../assets/images/About Research Units/Food Innovation Lab.jpg";

function ResearchUnits() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const researchFacilities = [
    {
      name: "Molecular Laboratory",
      description: "State-of-the-art facility for DNA analysis, PCR, and molecular research applications.",
      image: MolecularLab,
      path: "/MBML"
    },
    {
      name: "Analytical Laboratory",
      description: "Equipped with advanced instruments for chemical analysis and material testing.",
      image: AnalyticalLab,
      path: "/AnalyticalServicesLab"
    },
    {
      name: "Food Innovation Laboratory",
      description: "Dedicated space for food product development, testing, and quality analysis.",
      image: FoodInnovation,
      path: "/FoodInnovationLab"
    },
    {
      name: "Aquaculture Station",
      description: "Research facility for aquatic species cultivation and marine biology studies.",
      image: AquacultureStation,
      path: "/AquacultureResearchStation"
    },
    {
      name: "General Facility Station",
      description: "Multi-purpose laboratory space for various scientific experiments and research.",
      image: GeneralFacility,
      path: "/GeneralFacilities"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isMobile) return;

    let scrollPosition = scrollContainer.scrollLeft;
    const cardWidth = 320;
    const gap = 24;
    const totalWidth = (cardWidth + gap) * researchFacilities.length;
    const containerWidth = scrollContainer.clientWidth;
    const maxScroll = totalWidth - containerWidth;
    
    const scroll = () => {
      if (!scrollContainer) return;
      
      if (isHovered || isTouching) {
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }
      
      scrollPosition += 0.5;
      
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [researchFacilities.length, isHovered, isTouching, isMobile]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isMobile) return;

    const handleWheel = (e) => {
      if (isHovered) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isHovered, isMobile]);

  const handleTouchStart = () => setIsTouching(true);
  const handleTouchEnd = () => setIsTouching(false);
  const handleTouchCancel = () => setIsTouching(false);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-7">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-2 pb-0">
        <section className="mb-0">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Research Facilities
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              State-of-the-art laboratories equipped for advanced scientific research and innovation
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-30 h-0.5 bg-blue-600"></div>
            </div>
          </div>
          {isMobile ? (
            <div className="grid grid-cols-1 gap-6 px-4 max-w-md mx-auto">
              {researchFacilities.map((facility, index) => (
                <div 
                  key={index}
                  onClick={() => handleCardClick(facility.path)}
                  onKeyDown={(e) => handleKeyDown(e, facility.path)}
                  role="button"
                  tabIndex={0}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <img 
                      src={facility.image} 
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      {facility.description}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(facility.path);
                      }}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group/btn"
                    >
                      <span>Explore facility</span>
                      <svg className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Subtle Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrollable Cards Container */}
              <div 
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                className="overflow-x-auto pb-8 scrollbar-hide"
                style={{ scrollBehavior: 'auto' }}
              >
                <div className="flex flex-row gap-6 lg:gap-8 min-w-min px-8">
                  {researchFacilities.map((facility, index) => (
                    <div 
                      key={index}
                      onClick={() => handleCardClick(facility.path)}
                      onKeyDown={(e) => handleKeyDown(e, facility.path)}
                      role="button"
                      tabIndex={0}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-80 sm:w-96 flex-shrink-0 border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-50">
                        <img 
                          src={facility.image} 
                          alt={facility.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-3">
                          {facility.name}
                        </h3>
                        <p className="text-gray-500 mb-5 leading-relaxed line-clamp-3">
                          {facility.description}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(facility.path);
                          }}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group/btn text-sm font-medium"
                        >
                          <span>Learn more</span>
                          <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Instructions */}
              {(isTablet || isDesktop) && (
                <div className="flex justify-center mt-8 mb-5">
                  <p className="text-gray-400 text-xs flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>{isTablet ? 'Swipe to explore' : 'Scroll or swipe to explore'}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ResearchUnits;