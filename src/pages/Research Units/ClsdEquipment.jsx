import React, { useState, useEffect } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import equipmentData from "../../data/ClsdEquipment.js"; // Import the data

function ClsdEquipment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 6 : 8;
    }
    return 8;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = equipmentData.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedEquipment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl tracking-tight">
                <span className="text-gray-900 font-semibold">Available </span>
                <span className="text-blue-500 font-semibold">Equipment</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!selectedEquipment ? (
            /* Equipment Grid View */
            <div className="w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentItems.map((equipment, index) => (
                  <div
                    key={index}
                    onClick={() => handleEquipmentClick(equipment)}
                    className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col"
                  >
                    {/* Fixed size image container with exact dimensions */}
                    <div className="w-full pt-[100%] relative bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {/* Fixed height text container */}
                    <div className="p-3 sm:p-4 h-16 sm:h-20 flex items-center justify-center border-t border-gray-100">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {equipment.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page numbers - hide on very small screens if too many */}
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
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Equipment Detail View */
            <div className="w-full max-w-4xl mx-auto animate-fadeIn">
              {/* Back Button */}
              <button
                onClick={handleBackClick}
                className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Equipment List
              </button>

              {/* Equipment Detail Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section - Fixed size container */}
                  <div className="lg:w-1/2 bg-gray-100">
                    <div className="w-full pt-[75%] lg:pt-[100%] relative">
                      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                        <img
                          src={selectedEquipment.image}
                          alt={selectedEquipment.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="lg:w-1/2 p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                      {selectedEquipment.name}
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                          Description
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {selectedEquipment.description}
                        </p>
                      </div>
                      
                      {selectedEquipment.applications && (
                        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                          <h3 className="text-xs sm:text-sm font-semibold text-blue-800 mb-3">
                            Applications
                          </h3>
                          <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                            {selectedEquipment.applications.map((app, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {app}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Equipment Info */}
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs sm:text-sm text-gray-500">
                          For more information about this equipment or to schedule its use, 
                          please contact our laboratory staff.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClsdEquipment;