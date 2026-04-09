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
  Tag,
  RefreshCw,
  Download,
  X as XIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Image as ImageIcon
} from "lucide-react";

// Horizontal Water Filling Loading Component that completes in ~5 seconds
const WaterFillingLoading = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 38);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-50">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="relative">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${waterLevel}%` }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 bottom-0 w-full">
                  <div className="absolute top-0 bottom-0 w-20 bg-white/30 transform -skew-x-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -top-6 right-0 text-xs text-blue-600 font-medium">
            {Math.min(100, Math.floor(waterLevel))}%
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm font-medium">
            {waterLevel >= 100 ? 'Loading complete!' : 'Loading DOST funded projects...'}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function DostFundedProjectPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Gallery/Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
        setItemsPerPage(6);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(9);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the search config from searchConfigs
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

  // Add a handler for search results
  const onSearchResultsHandler = useCallback((results, query) => {
    handleSearchResults(results, query);
  }, [handleSearchResults]);

  // Apply status filter to searched results
  const filteredAndSearchedProjects = useMemo(() => {
    try {
      if (!filteredData || !Array.isArray(filteredData)) {
        return [];
      }
      
      let result = [...filteredData];

      if (statusFilter !== 'all') {
        result = result.filter(project => 
          project?.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
const handleDocumentDownload = async (document) => {
  // Show a subtle loading indicator if needed
  const button = document.activeElement;
  const originalHTML = button?.innerHTML;
  
  try {
    const url = document.download_url || document.url;
    
    if (!url) {
      console.error('No download URL available');
      return;
    }

    // Use fetch for authenticated/CORS requests
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document.file_name || document.name;
    
    // Prevent any visual feedback that causes blinking
    link.style.position = 'fixed';
    link.style.opacity = '0';
    link.style.pointerEvents = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback
    window.open(document.download_url || document.url, '_blank');
  }
};

  // Parse gallery
  const parseGallery = useCallback((gallery) => {
    if (!gallery) return [];
    if (Array.isArray(gallery)) return gallery;
    if (typeof gallery === 'string') {
      try {
        const parsed = JSON.parse(gallery);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [gallery];
      }
    }
    return [];
  }, []);

  // Parse documents
  const parseDocuments = useCallback((documents) => {
    if (!documents) return [];
    if (Array.isArray(documents)) return documents;
    if (typeof documents === 'string') {
      try {
        const parsed = JSON.parse(documents);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
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

  // Mobile-optimized Project Card
  const ProjectCard = useCallback(({ project }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(project)}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
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
        
        {project.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {project.title || "Untitled Project"}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
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

// Detail View Component with Gallery and Documents
const DetailView = useCallback(({ project }) => {
  const galleryImages = parseGallery(project.gallery);
  const documents = parseDocuments(project.documents);
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to DOST Funded Projects</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Section with Blended Title */}
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
          {/* Background Image */}
          {project.image && !heroImgError ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              </div>
              
              {/* Expand button */}
              <button
                onClick={() => window.open(project.image, '_blank')}
                className="absolute top-4 right-4 bg-black/60 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/80 transition-all z-10 backdrop-blur-sm"
              >
                <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 opacity-50">
                <Building2 className="w-16 h-16 sm:w-24 sm:h-24 text-blue-400" />
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-blue-500 rounded-full p-1.5 sm:p-2 shadow-lg flex items-center gap-1 sm:gap-1.5 backdrop-blur-sm">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured Project</span>
              </div>
            </div>
          )}
          
          {/* Title Overlay - Blended with Image */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-16">
              <div className="max-w-3xl">
                <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-3xl font-bold text-white drop-shadow-lg leading-tight">
                  {project.title || "Untitled Project"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Full Content - Description with icon and header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Description</h2>
            </div>
            <div 
              className="ml-4 sm:ml-7 prose prose-blue max-w-none text-sm sm:text-base text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: project.description || 'No description available.' 
              }}
            />
          </div>

          {/* Project Details */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {project.status && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Status</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatStatus(project.status)}</p>
                  </div>
                </div>
              )}

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

              {project.end_date && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">End Date</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(project.end_date)}</p>
                  </div>
                </div>
              )}

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
            <div className="border-t border-gray-200 pt-6 mt-6">
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

          {/* Gallery Section */}
          {galleryImages.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Project Gallery</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({galleryImages.length} images)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {galleryImages.map((image, index) => {
                  const [galleryImgError, setGalleryImgError] = useState(false);
                  
                  return (
                    <div
                      key={index}
                      className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                      style={{ height: '120px' }}
                      onClick={() => openGalleryModal(galleryImages, index)}
                    >
                      <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                        {!galleryImgError ? (
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                            onError={() => setGalleryImgError(true)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 flex items-center gap-1 sm:gap-2">
                          <span className="bg-black/60 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                            {index + 1}/{galleryImages.length}
                          </span>
                          <div className="bg-blue-600 text-white p-1 sm:p-1.5 rounded-full">
                            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {documents.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Project Documents</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({documents.length} files)</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-gray-900 font-medium truncate">
                          {document.name || document.file_name || `Document ${index + 1}`}
                        </p>
                        {document.size && (
                          <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(document.size)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                      <button
                        onClick={() => handleDocumentDownload(document)}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, [handleBackClick, formatDate, formatCurrency, formatStatus, parseGallery, parseDocuments, openGalleryModal, handleDocumentDownload]);

// Gallery Modal Component
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
                <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => navigateGallery('next')}
                disabled={currentImageIndex === selectedImage.length - 1}
                className={`absolute right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20 ${
                  currentImageIndex === selectedImage.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
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

  const renderContent = () => {
    if (selectedProject) {
      return <DetailView project={selectedProject} />;
    }

    if (filteredAndSearchedProjects.length === 0 && !loading) {
      let message = '';
      
      if (searchTerm && searchTerm.trim() !== '') {
        message = `No DOST funded projects found.`;
      } else if (statusFilter !== 'all') {
        message = `No ${statusFilter} DOST funded projects found.`;
      } else {
        message = 'No DOST funded projects found.';
      }
      
      return (
        <div className="text-center py-26">
          <p className="text-gray-500 text-sm sm:text-lg">
            {message}
          </p>
        </div>
      );
    }

    return (
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
                DOST Funded Projects
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Explore research and development projects funded by the Department of Science and Technology (DOST).
            </p>
          </div>
        </div>
      </section>

      {loading && <WaterFillingLoading />}

      {!selectedProject && !loading && (
        <>
          <div className="mt-15">
            <Search 
              data={dostProjects}
              searchKeys={searchConfig.searchFields}
              placeholder={searchConfig.placeholder}
              onSearchResults={onSearchResultsHandler}  // ← THIS IS CRITICAL
              onSearchStart={handleSearchStart}
              onSearchClear={handleSearchClear}
              showResultCount={searchConfigs.dostFundedProjects?.showResultCount}
              debounceTime={searchConfigs.dostFundedProjects?.debounceTime}
              minChars={searchConfigs.dostFundedProjects?.minChars}
              variant={searchConfigs.dostFundedProjects?.variant}
              size={searchConfigs.dostFundedProjects?.size}
              theme={searchConfigs.dostFundedProjects?.theme}
            />
          </div>
          
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
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
        </>
      )}

      <div className="flex-grow container mx-auto px-4 mt-8">
        {!loading && renderContent()}
      </div>
      
      <GalleryModal />
      
      <Footer/>
    </div>
  );
};

export default DostFundedProjectPage;