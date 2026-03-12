import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
import PLDData from "../../data/PLD.js";
import { ChevronLeft, ChevronRight, Users, Link as LinkIcon, BookOpen, FileText, ArrowLeft, ExternalLink } from "lucide-react";

function PLD() {
  const [filteredProjects, setFilteredProjects] = useState(PLDData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const itemsPerPage = 9; // 3 columns × 3 rows = 9 items per page
  const topRef = useRef(null);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects]);

  // Scroll to top when currentPage changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedPublication) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedPublication]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

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

  const handleCardClick = (publication) => {
    setSelectedPublication(publication);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPublication(null);
  };

  const PublicationCard = ({ publication }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(publication)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300">
            {publication.title}
          </h3>
          <div className="space-y-3">
            <p className="text-gray-600 flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">Authors:</span> {publication.authors}
              </span>
            </p>
            <p className="text-gray-600 flex items-start gap-2">
              <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">DOI:</span> {publication.DOI}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );

  const DetailView = ({ publication }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Philippine Lakes Database</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{publication.title}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
              <BookOpen className="w-4 h-4" />
              Research Publication
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Authors</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{publication.authors}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">DOI (Digital Object Identifier)</h2>
            </div>
            <p className="text-gray-700 ml-7 font-mono text-sm break-all">{publication.DOI}</p>
          </div>

          {publication.abstract && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Abstract</h2>
              </div>
              <p className="text-gray-700 ml-7 leading-relaxed">{publication.abstract}</p>
            </div>
          )}

          {publication.keywords && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Keywords</h2>
              </div>
              <div className="ml-7 flex flex-wrap gap-2">
                {publication.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {publication.journal && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Journal</h2>
              </div>
              <p className="text-gray-700 ml-7">{publication.journal}</p>
            </div>
          )}

          {publication.year && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Year</h2>
              </div>
              <p className="text-gray-700 ml-7">{publication.year}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <a 
              href={publication.ArticleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ExternalLink className="w-5 h-5" />
              View Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      {/* Add a hidden div as a scroll target */}
      <div ref={topRef} />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Philippine Lakes Database
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Comprehensive database of research publications and studies about Philippine lakes.
            </p>
          </div>
        </div>
      </section>
      
      {!selectedPublication && (
        <Search 
          className="mt-15"
          data={PLDData}
          searchKeys={['title', 'authors', 'keywords', 'abstract']}
          onSearchResults={setFilteredProjects}
          showResultCount={true}
        />
      )}

      <div className="flex-grow container mx-auto px-4 mt-14">
        {selectedPublication ? (
          <DetailView publication={selectedPublication} />
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No publications found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {currentProjects.map((publication) => (
                    <PublicationCard key={publication.id} publication={publication} />
                  ))}
                </div>

                {/* Pagination */}
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
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
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
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
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
                      aria-label="Next page"
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

export default PLD;