import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
import PLDData from "../../data/PLD.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Link as LinkIcon, 
  BookOpen, 
  FileText, 
  ArrowLeft, 
  ExternalLink,
  Filter,
  Award
} from "lucide-react";

function PLD() {
  const [filteredProjects, setFilteredProjects] = useState(PLDData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [yearFilter, setYearFilter] = useState('all');
  
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

  // Get unique years for filter
  const years = ['all', ...new Set(PLDData.map(pub => pub.year).filter(Boolean).sort((a, b) => b - a))];

  // Apply year filter to publications
  const getFilteredPublications = () => {
    let result = [...filteredProjects];
    
    // Apply Year Filter
    if (yearFilter !== 'all') {
      result = result.filter(pub => 
        pub.year?.toString() === yearFilter.toString()
      );
    }
    
    return result;
  };

  const displayedPublications = getFilteredPublications();

  // Reset to page 1 when search results or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects, yearFilter]);

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
  const totalPages = Math.ceil(displayedPublications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPublications = displayedPublications.slice(startIndex, endIndex);

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

  const handleYearFilterClick = (year) => {
    setYearFilter(year);
  };

  const clearFilters = () => {
    setFilteredProjects(PLDData);
    setYearFilter('all');
    setCurrentPage(1);
  };

  // Filter button style
  const getYearFilterButtonStyle = (year) => {
    const isActive = yearFilter === year;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-center inline-flex items-center justify-center min-w-[100px]";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  };
// Mobile-optimized Publication Card with fixed height title and underline
const PublicationCard = ({ publication }) => (
  <div 
    className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    onClick={() => handleCardClick(publication)}
  >
    {/* Hover line at bottom with rounded corners */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-br-md rounded-bl-md"></div>
    
    {/* Image Container - with gradient background */}
    <div className="relative pt-[60%] sm:pt-[56.25%] bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
      </div>
      
      {/* Year indicator - REMOVED */}
    </div>

    <div className="p-3 sm:p-4 flex flex-col flex-grow">
      {/* Fixed height title area with underline */}
      <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {publication.title}
        </h3>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2 mt-1">
        {/* Mobile: Show only authors */}
        <div className="flex sm:hidden flex-col space-y-1.5">
          <p className="text-gray-600 flex items-start gap-1.5">
            <Users className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs line-clamp-1">{publication.authors}</span>
          </p>
        </div>

        {/* Desktop: Show authors and DOI with icons only (no labels) */}
        <div className="hidden sm:block space-y-2">
          <p className="text-gray-600 flex items-start gap-2">
            <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm line-clamp-1">{publication.authors}</span>
          </p>
        </div>
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
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to Philippine Lakes Database</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{publication.title}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Research Publication
            </span>
            {publication.year && (
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                {publication.year}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Authors</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{publication.authors}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">DOI (Digital Object Identifier)</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 font-mono break-all">{publication.DOI}</p>
          </div>

          {publication.abstract && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Abstract</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{publication.abstract}</p>
            </div>
          )}

          {publication.keywords && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Keywords</h2>
              </div>
              <div className="ml-4 sm:ml-7 flex flex-wrap gap-1.5 sm:gap-2">
                {publication.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full"
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
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Journal</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7">{publication.journal}</p>
            </div>
          )}

          {publication.year && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Year</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7">{publication.year}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <a 
              href={publication.ArticleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
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
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
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
        <>
          <Search 
            className="mt-15"
            data={PLDData}
            searchKeys={['title', 'authors', 'keywords', 'abstract', 'journal']}
            onSearchResults={setFilteredProjects}
            showResultCount={true}
          />

          {/* Year Filter Buttons */}
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by year:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearFilterClick(year)}
                    className={getYearFilterButtonStyle(year)}
                  >
                    {year === 'all' ? 'All' : year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search/Filter Stats */}
          {(filteredProjects.length !== PLDData.length || yearFilter !== 'all') && (
            <div className="container mx-auto px-4 mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Found {displayedPublications.length} result{displayedPublications.length !== 1 ? 's' : ''}
                {yearFilter !== 'all' && ` from ${yearFilter}`}
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex-grow container mx-auto px-4 mt-14">
        {selectedPublication ? (
          <DetailView publication={selectedPublication} />
        ) : (
          <>
            {displayedPublications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-lg">No publications found.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                  {currentPublications.map((publication) => (
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