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
  const itemsPerPage = 9;
  const topRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMaterials]);

  useEffect(() => {
    if (topRef.current && !selectedMaterial) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedMaterial]);

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

  const MaterialCard = ({ material }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(material)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
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
            <FileText className="w-12 h-12 text-blue-400" />
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {material.title}
        </h3>
        
        {/* Category and Date without background colors */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
            {getCategoryIcon(material.category)}
            {material.category}
          </span>
          
          {material.date && (
            <span className="inline-flex items-center gap-1 text-sm text-gray-400">
              •
            </span>
          )}
          
          {material.date && (
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              {formatDate(material.date)}
            </span>
          )}
        </div>
        
        <div className="flex justify-end mt-auto pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
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
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to IEC Materials</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image */}
        {material.image && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={material.image} 
              alt={material.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{material.title}</h1>
        </div>

        <div className="p-6 md:p-8">
          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Description</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed whitespace-pre-line">
              {material.description}
            </p>
          </div>

          {/* Category and Date - aligned left, no borders */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                Category: <span className="font-medium text-gray-900">{material.category}</span>
              </span>
            </div>
            
            {material.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Published: <span className="font-medium text-gray-900">{formatDate(material.date)}</span>
                </span>
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
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
                <p className="text-gray-500 text-lg">No IEC materials found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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