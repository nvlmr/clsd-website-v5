// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research and Development\ResearchInitiatives.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
import { searchConfigs } from "../../config/searchConfigs.js";
import { useSearch } from "../../hooks/useSearch.js";
import useResearchInitiatives from "../../hooks/ResearchInitiatives.js";
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
  WifiOff,
  AlertCircle
} from "lucide-react";

function ResearchInitiatives() {
  const {
    data: researchInitiatives,
    localData,
    loading,
    error,
    source,
    serverAvailable,
    refetch,
    getInitiativeById
  } = useResearchInitiatives();

  // Safely prepare data for search
  const searchData = useMemo(() => {
    return (researchInitiatives && researchInitiatives.length > 0) 
      ? researchInitiatives 
      : (localData || []);
  }, [researchInitiatives, localData]);

  // Use the custom search hook with error handling
  const searchConfig = useMemo(() => {
    return searchConfigs.researchInitiatives || {
      searchFields: ['title', 'description', 'project_lead'],
      placeholder: 'Search research initiatives...'
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
  } = useSearch(searchData, searchConfig);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchError, setSearchError] = useState(null);
  
  const itemsPerPage = 9;
  const topRef = useRef(null);

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

      return result;
    } catch (err) {
      console.error("Error filtering projects:", err);
      setSearchError("Error filtering projects");
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

  const handleClearFilters = useCallback(() => {
    setStatusFilter('all');
    resetSearch();
  }, [resetSearch]);

  // Wrapper for search handlers with error handling
  const handleSearchResultsWrapper = useCallback((results) => {
    try {
      setSearchError(null);
      handleSearchResults(results);
    } catch (err) {
      console.error("Search results error:", err);
      setSearchError("Error processing search results");
    }
  }, [handleSearchResults]);

  const handleSearchStartWrapper = useCallback(() => {
    try {
      handleSearchStart();
    } catch (err) {
      console.error("Search start error:", err);
    }
  }, [handleSearchStart]);

  const handleSearchClearWrapper = useCallback(() => {
    try {
      handleSearchClear();
    } catch (err) {
      console.error("Search clear error:", err);
    }
  }, [handleSearchClear]);

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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return amount.toString();
    }
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusColors = {
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      upcoming: "bg-yellow-100 text-yellow-800"
    };
    const colorClass = statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
        {status || "N/A"}
      </span>
    );
  }, []);

  const getStatusFilterButtonStyle = useCallback((status) => {
    const isActive = statusFilter === status;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[100px] text-center";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  }, [statusFilter]);

  const ProjectCard = useCallback(({ project }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(project)}
    >
      {/* Card content remains the same */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      {/* Status Badge and Featured Label */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        {project.featured === 1 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900 shadow-md">
            <Award className="w-3 h-3 mr-1" />
            Featured
          </span>
        )}
        {getStatusBadge(project.status)}
      </div>

      {/* Image Section */}
      {project.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/400/320';
            }}
          />
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {project.title || "Untitled Project"}
          </h2>
          
          <div className="space-y-2">
            <p className="text-gray-600 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm">
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-2">
              <UserCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm">
                <span className="font-medium">Lead:</span> {project.project_lead || "N/A"}
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-2">
              <Landmark className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm">
                <span className="font-medium">Funding:</span> {project.funding_source || "N/A"}
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm">
                <span className="font-medium">Implementing:</span> {project.implementing_agency || "N/A"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 pt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  ), [handleCardClick, formatDate, getStatusBadge]);

  const DetailView = useCallback(({ project }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Research Initiatives</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Detail view content remains the same */}
        {/* Header Image */}
        {project.image && (
          <div className="h-64 md:h-80 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/800/400';
              }}
            />
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {getStatusBadge(project.status)}
            {project.featured === 1 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{project.title || "Untitled Project"}</h1>
          
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 bg-opacity-50 text-white text-sm font-semibold rounded-full">
              <Calendar className="w-4 h-4" />
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
            
            {project.location && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 bg-opacity-50 text-white text-sm font-semibold rounded-full">
                <MapPin className="w-4 h-4" />
                {project.location}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Description */}
          {project.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Project Description</h2>
              </div>
              <p className="text-gray-700 ml-7 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Objectives */}
          {project.objectives && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Objectives</h2>
              </div>
              {project.objectives.includes(';') ? (
                <ul className="list-disc list-inside ml-7 space-y-2">
                  {project.objectives.split(';').map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 ml-7">{project.objectives}</p>
              )}
            </div>
          )}

          {/* Project Lead */}
          {project.project_lead && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <UserCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Project Lead</h2>
              </div>
              <p className="text-gray-700 ml-7">{project.project_lead}</p>
            </div>
          )}

          {/* Team Members */}
          {project.team_members && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
              </div>
              {project.team_members.includes(',') ? (
                <div className="ml-7 flex flex-wrap gap-2">
                  {project.team_members.split(',').map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {member.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 ml-7">{project.team_members}</p>
              )}
            </div>
          )}

          {/* Funding Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Funding Source</h2>
              </div>
              <p className="text-gray-700 ml-7">{project.funding_source || "N/A"}</p>
            </div>

            {project.budget && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Budget</h2>
                </div>
                <p className="text-gray-700 ml-7 font-semibold text-lg">
                  {formatCurrency(project.budget)}
                </p>
              </div>
            )}
          </div>

          {/* Implementing Agency */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Implementing Agency</h2>
            </div>
            <p className="text-gray-700 ml-7">{project.implementing_agency || "N/A"}</p>
          </div>

          {/* Cooperating Agency */}
          {project.cooperating_agency && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Cooperating Agency</h2>
              </div>
              {project.cooperating_agency.includes(',') ? (
                <div className="ml-7 space-y-1">
                  {project.cooperating_agency.split(',').map((agency, index) => (
                    <p key={index} className="text-gray-700">• {agency.trim()}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 ml-7">{project.cooperating_agency}</p>
              )}
            </div>
          )}

          {/* Location */}
          {project.location && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>
              <p className="text-gray-700 ml-7">{project.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ), [handleBackClick, formatDate, formatCurrency, getStatusBadge]);

  // Loading state
  if (loading && searchData.length === 0) {
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
                  Research Initiatives
                </span>
              </h1>
            </div>
          </div>
        </section>
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

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
                Research Initiatives
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Driving innovative research initiatives that transform ideas into impactful, real-world solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Connection Status */}
      {!serverAvailable && !loading && !error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                ⚠️ You are viewing offline data. Connect to the server for latest updates.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Search Error Display */}
      {searchError && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{searchError}</p>
          </div>
        </div>
      )}
      
      {!selectedProject && (
        <>
          {/* Search Component with configuration */}
          <div className="mt-15">
            <Search 
              data={searchData}
              searchFields={searchConfig.searchFields}
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
                <Filter className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                {statusFilter !== 'all' && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full transition-colors ml-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {['all', 'ongoing', 'completed', 'upcoming'].map((status) => (
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
              <p className="text-sm text-gray-600">
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
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-red-700">Error: {error}</p>
                {!serverAvailable && (
                  <p className="text-sm text-gray-600 mt-2">
                    ⚠️ Using offline data. Some information may not be up to date.
                  </p>
                )}
                <button
                  onClick={() => refetch()}
                  className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {filteredAndSearchedProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No research projects found.</p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {currentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
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
      </div>
      <Footer/>
    </div>
  );
};

export default ResearchInitiatives;