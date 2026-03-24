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
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Download,
  X as XIcon,
  Maximize2
} from "lucide-react";

function ResearchInitiatives() {
  const {
    data: researchInitiatives,
    localData,
    loading,
    error,
    refetch
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
      searchFields: ['title', 'description', 'project_lead', 'objectives'],
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
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Gallery/Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const topRef = useRef(null);

  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6); // Mobile: 6 items
      } else {
        setItemsPerPage(9); // Desktop: 9 items
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply status filter to searched results and sort by featured
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

      // Sort by featured (featured = 1 first, then by date or other criteria)
      result.sort((a, b) => {
        // Featured items come first
        if (a.featured === 1 && b.featured !== 1) return -1;
        if (a.featured !== 1 && b.featured === 1) return 1;
        
        // If both have same featured status, sort by date (newest first) if available
        if (a.start_date && b.start_date) {
          return new Date(b.start_date) - new Date(a.start_date);
        }
        
        return 0;
      });

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

  // Gallery modal functions
  const openGalleryModal = (images, index) => {
    setSelectedImage(images);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGalleryModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateGallery = (direction) => {
    if (!selectedImage) return;
    
    if (direction === 'next' && currentImageIndex < selectedImage.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeGalleryModal();
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next');
      } else if (e.key === 'ArrowLeft') {
        navigateGallery('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex, selectedImage]);

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

  // Format status for display
  const formatStatus = useCallback((status) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }, []);

  // Get status color - now only used in filter buttons, not in detail view
  const getStatusColor = useCallback((status) => {
    switch(status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Download attachment
  const downloadAttachment = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  // Updated filter button style with proper centering
  const getStatusFilterButtonStyle = useCallback((status) => {
    const isActive = statusFilter === status;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-center inline-flex items-center justify-center min-w-[100px]";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  }, [statusFilter]);

  // YOUR ORIGINAL ProjectCard - PRESERVED EXACTLY
  const ProjectCard = useCallback(({ project }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(project)}
    >
      {/* Blue line at the bottom on hover - matching NewsEvents */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - matching NewsEvents styling */}
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=Research+Initiative";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            </div>
          )}
        </div>
        
        {/* Featured indicator - Blue like NewsEvents */}
        {project.featured === 1 && (
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
          {/* Mobile: Show only Project Lead and Implementing Agency with icons */}
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

          {/* Desktop: Show only Project Lead and Implementing Agency with icons */}
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

  // UPDATED DetailView - Status removed from hero image and made consistent with other details
  const DetailView = useCallback(({ project }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to Research Initiatives</span>
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
            
            {/* Status badge removed from hero image */}
            
            {/* Expand button */}
            <button
              onClick={() => window.open(project.image, '_blank')}
              className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-80 transition-all"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {/* Featured indicator */}
            {project.featured === 1 && (
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
        {!project.image && project.featured === 1 && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white relative">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 pr-24 sm:pr-32">{project.title || "Untitled Project"}</h1>
          </div>
        )}

        {/* If there is a hero image, title is in the gradient overlay */}
        {project.image && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{project.title || "Untitled Project"}</h1>
          </div>
        )}

        {/* If no hero image and not featured, just show title in blue header */}
        {!project.image && project.featured !== 1 && (
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
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">Project Description</h2>
              </div>
              <div className="ml-4 sm:ml-7 prose prose-blue max-w-none text-sm sm:text-base text-gray-700">
                <p className="leading-relaxed">{project.description}</p>
              </div>
            </div>
          )}

          {/* Objectives */}
          {project.objectives && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-sm sm:text-lg font-bold text-gray-900">Objectives</h2>
              </div>
              <div className="ml-4 sm:ml-7">
                {typeof project.objectives === 'string' && project.objectives.includes(';') ? (
                  <ul className="list-disc list-inside space-y-2">
                    {project.objectives.split(';').map((objective, index) => (
                      <li key={index} className="text-sm sm:text-base text-gray-700">{objective.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm sm:text-base text-gray-700">{project.objectives}</p>
                )}
              </div>
            </div>
          )}

          {/* Project Details Grid */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Status - Now consistent with other details (no colored badge) */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{formatStatus(project.status)}</p>
                </div>
              </div>

              {/* Project Lead */}
              {project.project_lead && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Project Lead</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{project.project_lead}</p>
                  </div>
                </div>
              )}

              {/* Start Date */}
              {project.start_date && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Start Date</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(project.start_date)}</p>
                  </div>
                </div>
              )}

              {/* End Date */}
              {project.end_date && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">End Date</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(project.end_date)}</p>
                  </div>
                </div>
              )}

              {/* Funding Source */}
              {project.funding_source && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Funding Source</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{project.funding_source}</p>
                  </div>
                </div>
              )}

              {/* Budget */}
              {project.budget && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {project.location && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{project.location}</p>
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
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{project.implementing_agency}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          {project.team_members && project.team_members.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Team Members</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({project.team_members.length} members)</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-4 sm:ml-7">
                {Array.isArray(project.team_members) ? (
                  project.team_members.map((member, index) => (
                    <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {member}
                    </span>
                  ))
                ) : typeof project.team_members === 'string' ? (
                  project.team_members.split(',').map((member, index) => (
                    <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {member.trim()}
                    </span>
                  ))
                ) : null}
              </div>
            </div>
          )}

          {/* Cooperating Agencies */}
          {project.cooperating_agency && project.cooperating_agency.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Cooperating Agencies</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({project.cooperating_agency.length} agencies)</span>
              </div>
              <div className="ml-4 sm:ml-7 space-y-1">
                {Array.isArray(project.cooperating_agency) ? (
                  project.cooperating_agency.map((agency, index) => (
                    <p key={index} className="text-sm sm:text-base text-gray-700">• {agency}</p>
                  ))
                ) : typeof project.cooperating_agency === 'string' ? (
                  project.cooperating_agency.split(',').map((agency, index) => (
                    <p key={index} className="text-sm sm:text-base text-gray-700">• {agency.trim()}</p>
                  ))
                ) : null}
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Gallery</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({project.gallery.length} images)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {project.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                    style={{ height: '120px' }}
                    onClick={() => openGalleryModal(project.gallery, index)}
                  >
                    <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        }}
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 flex items-center gap-1 sm:gap-2">
                        <span className="bg-black/60 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                          {index + 1}/{project.gallery.length}
                        </span>
                        <div className="bg-blue-600 text-white p-1 sm:p-1.5 rounded-full">
                          <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documents && project.documents.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Documents</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({project.documents.length} files)</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {project.documents.map((doc, index) => {
                  const docUrl = typeof doc === 'string' ? doc : doc.url;
                  const docName = typeof doc === 'string' ? `Document ${index + 1}` : (doc.name || `Document ${index + 1}`);
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{docName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                        <button
                          onClick={() => downloadAttachment(docUrl, docName)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ), [handleBackClick, formatDate, formatCurrency, formatStatus, openGalleryModal, downloadAttachment]);

  // Gallery Modal - from NewsEvents
  const GalleryModal = () => {
    if (!isModalOpen || !selectedImage) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={closeGalleryModal}
        />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={closeGalleryModal}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 sm:p-2 transition-all z-20"
          >
            <XIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white bg-black bg-opacity-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            {currentImageIndex + 1} / {selectedImage.length}
          </div>

          {selectedImage.length > 1 && (
            <>
              <button
                onClick={() => navigateGallery('prev')}
                disabled={currentImageIndex === 0}
                className={`absolute left-2 sm:left-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20 ${
                  currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => navigateGallery('next')}
                disabled={currentImageIndex === selectedImage.length - 1}
                className={`absolute right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20 ${
                  currentImageIndex === selectedImage.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full">
            <img
              src={selectedImage[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />
          </div>

          <a
            href={selectedImage[currentImageIndex]}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20"
            title="Download image"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    );
  };

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
                Research Initiatives
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Driving innovative research initiatives that transform ideas into impactful, real-world solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Research Initiatives...</p>
        </div>
      )}

      {/* Search Error Display */}
      {searchError && !loading && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{searchError}</p>
          </div>
        </div>
      )}
      
      {/* Main Content - Only show when not loading */}
      {!loading && (
        <>
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
              <>
                <DetailView project={selectedProject} />
                <GalleryModal />
              </>
            ) : (
              <>
                {/* Error Display */}
                {error && !error.includes('Server not available') && !loading && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <p className="text-red-700">{error}</p>
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
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
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
        </>
      )}
      <Footer/>
    </div>
  );
};

export default ResearchInitiatives;