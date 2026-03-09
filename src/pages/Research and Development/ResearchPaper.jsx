import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import researchPapersData from "../../data/ResearchPaper.js";

function ResearchPaper() {
  const [filteredPapers, setFilteredPapers] = useState(researchPapersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns × 3 rows = 9 items per page
  const topRef = useRef(null);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPapers]);

  // Scroll to top when currentPage changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

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

  const clearSearch = () => {
    setFilteredPapers(researchPapersData);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      {/* Add a hidden div as a scroll target */}
      <div ref={topRef} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Research Paper
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Scientific research supporting the sustainable development and conservation of lake environments.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4">

        {/* Search Section */}
        <div className="mb-12">
          <Search
            data={researchPapersData}
            searchKeys={['title', 'authors', 'adviser', 'degreeSought', 'Year', 'Manusript']}
            onSearchResults={setFilteredPapers}
            debounceTime={300}
            showResultCount={true}
            variant="default"
            size="lg"
            theme="light"
          />
        </div>

        {/* Research Paper Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3">
                {paper.title}
              </h3>

              {/* Author */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Author:</span> {paper.authors}
                </p>
              </div>

              {/* Degree */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Degree:</span> {paper.degreeSought}
                </p>
              </div>

              {/* Adviser */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Adviser:</span> {paper.adviser}
                </p>
              </div>

              {/* Year */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Year:</span> {paper.Year}
                </p>
              </div>

              {/* Manuscript Type */}
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Type:</span> {paper.Manusript}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && filteredPapers.length > 0 && (
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
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
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
        )}

        {/* No Results Message */}
        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? `No papers found for "${searchQuery}"` : "No research papers found."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ResearchPaper;