import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const autoPlayIntervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const researchFacilities = [
    {
      name: "Molecular Biology & Microbiology",
      description: "State-of-the-art facility for DNA analysis, PCR, and molecular research applications.",
      image: MolecularLab,
      path: "/MBML"
    },
    {
      name: "Analytical Instrumentation",
      description: "Equipped with advanced instruments for chemical analysis and material testing.",
      image: AnalyticalLab,
      path: "/AnalyticalIntrumentation"
    },
    {
      name: "Food Innovation",
      description: "Dedicated space for food product development, testing, and quality analysis.",
      image: FoodInnovation,
      path: "/FoodInnovation"
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    navigate(path);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(path);
    }
  };

  // Mobile carousel navigation with slide effect
  const goToNextPage = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    setCurrentPage((prev) => (prev + 1) % researchFacilities.length);
    setTimeout(() => setIsSliding(false), 500);
  }, [researchFacilities.length, isSliding]);

  const goToPrevPage = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    setCurrentPage((prev) => (prev - 1 + researchFacilities.length) % researchFacilities.length);
    setTimeout(() => setIsSliding(false), 500);
  }, [researchFacilities.length, isSliding]);

  // Auto-play for mobile carousel
  useEffect(() => {
    if (!isMobile) return;

    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    if (!isHovered && !isTouching) {
      autoPlayIntervalRef.current = setInterval(() => {
        goToNextPage();
      }, 4000);
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isMobile, isHovered, isTouching, goToNextPage]);

  // Smooth swipe handling for mobile
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goToNextPage();
    }
    
    if (isRightSwipe) {
      goToPrevPage();
    }
    
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleTouchCancel = () => {
    setIsTouching(false);
    setTouchStart(0);
    setTouchEnd(0);
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

  // Desktop/Tablet infinite scroll animation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isMobile) return;

    let scrollPosition = scrollContainer.scrollLeft;
    const cardWidth = 384; // Fixed width for consistency (w-96 = 384px)
    const gap = 32; // gap-8 = 32px
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

  // Desktop/Tablet wheel scroll handling
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

  // Render mobile carousel with simple card swiping
  const renderMobileCarousel = () => {
    const currentFacility = researchFacilities[currentPage];
    
    return (
      <div className="px-4 max-w-md mx-auto">
        {/* Carousel Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          className="relative overflow-hidden"
        >
          {/* Main Card with swipe animation */}
          <div 
            onClick={() => handleCardClick(currentFacility.path)}
            onKeyDown={(e) => handleKeyDown(e, currentFacility.path)}
            role="button"
            tabIndex={0}
            className={`transform transition-all duration-500 ease-out ${
              isSliding ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
            }`}
          >
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              <div className="relative h-56 overflow-hidden bg-gray-50">
                <img 
                  src={currentFacility.image} 
                  alt={currentFacility.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5 min-h-[180px] flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                  {currentFacility.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3 min-h-[60px]">
                  {currentFacility.description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(currentFacility.path);
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group/btn mt-auto"
                >
                  <span>Explore facility</span>
                  <svg className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {researchFacilities.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === currentPage || isSliding) return;
                if (index > currentPage) {
                  goToNextPage();
                } else {
                  goToPrevPage();
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentPage
                  ? 'w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to facility ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Simple slide animation
  const animationsStyle = `
    @keyframes slideIn {
      0% {
        opacity: 0;
        transform: translateX(30px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pt-1 pb-7 sm:pt-12">
      <style>{animationsStyle}</style>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-2 pb-0">
        <section className="mb-0">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-4">
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
            renderMobileCarousel()
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
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-6 min-h-[220px] flex flex-col">
                        <h3 className="text-xl font-medium text-gray-900 mb-3 line-clamp-2 min-h-[56px]">
                          {facility.name}
                        </h3>
                        <p className="text-gray-500 mb-5 leading-relaxed line-clamp-3 min-h-[72px]">
                          {facility.description}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(facility.path);
                          }}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group/btn text-sm font-medium mt-auto"
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

              {/* Navigation Instructions - No arrows */}
              {(isTablet || isDesktop) && (
                <div className="flex justify-center mt-8 mb-5">
                  <p className="text-gray-400 text-xs bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    {isTablet ? 'Swipe to explore' : 'Scroll or swipe to explore'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ResearchUnits;