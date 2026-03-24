import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import IECMaterialsData from "../../data/IECMaterials.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Image, 
  Video, 
  BookOpen, 
  ArrowLeft,
  Tag,
  Calendar
} from "lucide-react";

function IEC_Materials() {
  const [filteredMaterials, setFilteredMaterials] = useState(IECMaterialsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  const topRef = useRef(null);

  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6); // Mobile: 6 items
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8); // Tablet: 8 items
      } else {
        setItemsPerPage(9); // Desktop: 9 items
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMaterials]);

  // Scroll to top when currentPage changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedMaterial) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedMaterial]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMaterials = filteredMaterials.slice(startIndex, endIndex);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (material) => {
    setSelectedMaterial(material);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedMaterial(null);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Category icon mapping
  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'brochure':
        return <FileText className="w-4 h-4" />;
      case 'poster':
        return <Image className="w-4 h-4" />;
      case 'infographic':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'manual':
        return <BookOpen className="w-4 h-4" />;
      case 'handbook':
        return <BookOpen className="w-4 h-4" />;
      case 'fact sheet':
        return <FileText className="w-4 h-4" />;
      case 'educational material':
        return <BookOpen className="w-4 h-4" />;
      case 'presentation material':
        return <FileText className="w-4 h-4" />;
      case 'digital asset':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
// Mobile-optimized Material Card with fixed height title and underline
  const MaterialCard = ({ material }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(material)}
    >
      {/* Blue line at the bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - with aspect ratio */}
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {material.image ? (
            <img 
              src={material.image} 
              alt={material.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=IEC+Material";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              {getCategoryIcon(material.category)}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Fixed height title area with underline */}
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {material.title}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          {/* Mobile: Show only category */}
          <div className="flex sm:hidden flex-col space-y-1.5">
            <span className="text-gray-600 flex items-start gap-1.5">
              <Tag className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs capitalize line-clamp-1">{material.category}</span>
            </span>
          </div>

          {/* Desktop: Show category and date stacked */}
          <div className="hidden sm:block space-y-2">
            {/* Category */}
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3 text-blue-500" />
              <span className="text-xs sm:text-sm text-gray-600 capitalize">
                {material.category}
              </span>
            </div>
            
            {/* Date (if available) */}
            {material.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-blue-500" />
                <span className="text-xs sm:text-sm text-gray-600">
                  {formatDate(material.date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  const DetailView = ({ material }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to IEC Materials</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image Section */}
        {material.image && (
          <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
            <img 
              src={material.image} 
              alt={material.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        )}

        {/* Title section */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{material.title}</h1>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Description first */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {material.description}
            </p>
          </div>

          {/* Category and Date with icons */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs sm:text-sm text-gray-500">Category</span>
                <p className="text-sm sm:text-base text-gray-900 font-medium capitalize">{material.category}</p>
              </div>
            </div>
            
            {material.date && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">Published</span>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">{formatDate(material.date)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      <div ref={topRef} />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                IEC Materials
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Information, Education, and Communication materials for lake conservation awareness and education.
            </p>
          </div>
        </div>
      </section>
      
      {!selectedMaterial && (
        <Search 
          className="mt-15"
          data={IECMaterialsData}
          searchKeys={['title', 'description', 'category']}
          onSearchResults={setFilteredMaterials}
          showResultCount={true}
        />
      )}

      <div className="flex-grow container mx-auto px-4 mt-14">
        {selectedMaterial ? (
          <DetailView material={selectedMaterial} />
        ) : (
          <>
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-lg">No IEC materials found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                  {currentMaterials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                    <button
                      onClick={() => handlePageChange('prev')}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange('next')}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default IEC_Materials;