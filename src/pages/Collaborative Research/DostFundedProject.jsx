// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Collaborative Research\DostFundedProject.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
import { searchConfigs } from "../../config/searchConfigs.js";
import { useSearch } from "../../hooks/useSearch.js";
import useDostFundedProjects from "../../hooks/DostFundedProject.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Building2, 
  Landmark, 
  FileText, 
  ArrowLeft,
  Users,
  MapPin,
  DollarSign,
  Award,
  UserCircle,
  Filter,
  AlertCircle,
  Clock,
  Tag
} from "lucide-react";

function DostFundedProjectPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  const topRef = useRef(null);

  // Use the custom hook for projects
  const { 
    projects: dostProjects, 
    loading, 
    error,
    refresh 
  } = useDostFundedProjects();

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

  // Use the search config from searchConfigs but only for search fields and placeholder
  const searchConfig = useMemo(() => {
    return {
      searchFields: searchConfigs.dostFundedProjects?.searchKeys || ['title', 'project_lead', 'implementing_agency', 'cooperating_agency', 'status', 'description'],
      placeholder: searchConfigs.dostFundedProjects?.placeholder || 'Search DOST funded projects...'
    };
  }, []);

  const {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch
  } = useSearch(dostProjects, searchConfig);

  // Apply status filter to searched results
  const filteredAndSearchedProjects = useMemo(() => {
    try {
      if (!filteredData || !Array.isArray(filteredData)) {
        return [];
      }
      
      let result = [...filteredData];

      // Apply Status Filter
      if (statusFilter !== 'all') {
        result = result.filter(project => 
          project?.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Sort by featured (featured projects first)
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // If both have same featured status, sort by date (newest first) if available
        if (a.start_date && b.start_date) {
          return new Date(b.start_date) - new Date(a.start_date);
        }
        
        return 0;
      });

      return result;
    } catch (err) {
      console.error("Error filtering projects:", err);
      return [];
    }
  }, [filteredData, statusFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Scroll to top when page changes or project selected
  useEffect(() => {
    if (topRef.current && !selectedProject) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedProject]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSearchedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredAndSearchedProjects.slice(startIndex, endIndex);

  const handlePageChange = useCallback((direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleCardClick = useCallback((project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleStatusFilterClick = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  // Wrapper for search handlers
  const handleSearchResultsWrapper = useCallback((results) => {
    handleSearchResults(results);
  }, [handleSearchResults]);

  const handleSearchStartWrapper = useCallback(() => {
    handleSearchStart();
  }, [handleSearchStart]);

  const handleSearchClearWrapper = useCallback(() => {
    handleSearchClear();
  }, [handleSearchClear]);

  // Helper functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  }, []);

  const formatCurrency = useCallback((amount) => {
    if (!amount) return "N/A";
    try {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return amount.toString();
    }
  }, []);

  const formatDuration = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [formatDate]);

  const formatStatus = useCallback((status) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }, []);

  // Filter button style
  const getStatusFilterButtonStyle = useCallback((status) => {
    const isActive = statusFilter === status;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-center inline-flex items-center justify-center min-w-[100px]";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  }, [statusFilter]);

  // Mobile-optimized Project Card with fixed height title and underline
  const ProjectCard = useCallback(({ project }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(project)}
    >
      {/* Blue line at the bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - with aspect ratio */}
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=DOST+Funded+Project";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            </div>
          )}
        </div>
        
        {/* Featured indicator */}
        {project.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Fixed height title area with underline */}
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {project.title || "Untitled Project"}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          {/* Mobile: Show only Project Leader and Implementing Agency with icons */}
          <div className="flex sm:hidden flex-col space-y-1.5">
            <p className="text-gray-600 flex items-start gap-1.5">
              <UserCircle className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">{project.project_lead || "N/A"}</span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-1.5">
              <Building2 className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">{project.implementing_agency || "N/A"}</span>
            </p>
          </div>

          {/* Desktop: Show only Project Leader and Implementing Agency with icons */}
          <div className="hidden sm:block space-y-2">
            <p className="text-gray-600 flex items-start gap-2">
              <UserCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">{project.project_lead || "N/A"}</span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">{project.implementing_agency || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [handleCardClick]);

  // Detail View Component
  const DetailView = useCallback(({ project }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to DOST Funded Projects</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image */}
        {project.image && (
          <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(project.image, '_blank')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Featured indicator */}
            {project.featured && (
              <div className="absolute top-4 left-4">
                <div className="bg-blue-500 rounded-full p-1.5 sm:p-2 shadow-lg flex items-center gap-1 sm:gap-1.5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* If no hero image, put featured indicator in the colored header */}
        {!project.image && project.featured && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white relative">
            <div className="absolute top-4 left-4">
              <div className="bg-blue-500 rounded-full p-1.5 sm:p-2 shadow-lg flex items-center gap-1 sm:gap-1.5">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 pl-24 sm:pl-32">{project.title || "Untitled Project"}</h1>
          </div>
        )}

        {/* If there is a hero image, title is in the gradient overlay */}
        {project.image && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{project.title || "Untitled Project"}</h1>
          </div>
        )}

        {/* If no hero image and not featured, just show title in blue header */}
        {!project.image && !project.featured && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{project.title || "Untitled Project"}</h1>
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Description */}
          {project.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Project Description</h2>
              </div>
              <div 
                className="ml-4 sm:ml-7 prose prose-blue max-w-none text-sm sm:text-base text-gray-700"
              >
                <p className="leading-relaxed">{project.description}</p>
              </div>
            </div>
          )}

          {/* Project Details Grid */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Status */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{formatStatus(project.status)}</p>
                </div>
              </div>

              {/* Project Leader */}
              {project.project_lead && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Project Leader</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{project.project_lead}</p>
                  </div>
                </div>
              )}

              {/* Funding Source */}
              {project.funding_amount && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Funding Source</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">DOST</p>
                  </div>
                </div>
              )}

              {/* Budget */}
              {project.funding_amount && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatCurrency(project.funding_amount)}</p>
                  </div>
                </div>
              )}

              {/* Duration */}
              {project.start_date && project.end_date && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatDuration(project.start_date, project.end_date)}</p>
                  </div>
                </div>
              )}

              {/* Implementing Agency */}
              {project.implementing_agency && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Implementing Agency</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{project.implementing_agency}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cooperating Agency */}
          {project.cooperating_agency && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Cooperating Agency</h3>
              </div>
              {project.cooperating_agency.includes(',') ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-4 sm:ml-7">
                  {project.cooperating_agency.split(',').map((agency, index) => (
                    <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {agency.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7">{project.cooperating_agency}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ), [handleBackClick, formatDuration, formatCurrency, formatStatus]);

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
                DOST Funded Projects
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Explore research and development projects funded by the Department of Science and Technology (DOST).
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading DOST funded projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={() => refresh()}
              className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {!selectedProject && !loading && !error && (
        <>
          {/* Search Component - keeping original styling */}
          <div className="mt-15">
            <Search 
              data={dostProjects}
              searchKeys={searchConfig.searchFields}
              placeholder={searchConfig.placeholder}
              onSearchResults={handleSearchResultsWrapper}
              onSearchStart={handleSearchStartWrapper}
              onSearchClear={handleSearchClearWrapper}
            />
          </div>
          
          {/* Status Filter Buttons */}
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['all', 'ongoing', 'completed', 'proposed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterClick(status)}
                    className={getStatusFilterButtonStyle(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Stats */}
          {searchTerm && (
            <div className="container mx-auto px-4 mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Found {filteredAndSearchedProjects.length} results for "{searchTerm}"
                {statusFilter !== 'all' && ` in ${statusFilter} status`}
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex-grow container mx-auto px-4 mt-8">
        {selectedProject ? (
          <DetailView project={selectedProject} />
        ) : (
          <>
            {loading ? null : error ? null : (
              <>
                {filteredAndSearchedProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm sm:text-lg">No projects found.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                      {currentProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
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
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default DostFundedProjectPage;