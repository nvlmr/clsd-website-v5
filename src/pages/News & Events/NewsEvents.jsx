// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\News & Events\NewsEvents.jsx
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { searchConfigs } from "../../config/searchConfigs.js";
import { useSearch } from "../../hooks/useSearch.js";
import useNewsEvents from "../../hooks/NewsEvents.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Tag, 
  FileText, 
  ArrowLeft,
  Filter,
  Download,
  X as XIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Image as ImageIcon,
  Award
} from "lucide-react";

function NewsEvents() {
  const { 
    data: NewsEventsData, 
    loading, 
    error, 
    refresh 
  } = useNewsEvents();

  // Use the custom search hook
  const {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch
  } = useSearch(NewsEventsData, searchConfigs.newsEvents);

  // 1. State Management
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  // 2. Apply filter to searched results
  const filteredAndSearchedEvents = React.useMemo(() => {
    let result = [...filteredData];

    // Apply Category Filter
    if (activeFilter !== 'all') {
      result = result.filter(event => 
        event.type?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    return result;
  }, [filteredData, activeFilter]);

  // 3. Pagination calculation
  const totalPages = Math.ceil(filteredAndSearchedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredAndSearchedEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, filteredData]);

  // Scroll to top when page changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedEvent) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedEvent]);

  // 4. Action Handlers
  const handleFilterClick = (type) => {
    setActiveFilter(type);
  };

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

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

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

  // Format date for display
  const formatEventDate = (startDate, endDate) => {
    if (!startDate) return 'Date TBA';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (startDate === endDate || !endDate) {
      return start.toLocaleDateString('en-US', options);
    } else {
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
  };

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

  // Filter button styling
  const getFilterButtonStyle = (type) => {
    const isActive = activeFilter === type;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[100px] text-center";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
    };
  // Mobile-optimized EventCard - with fixed height title area and underline
  const EventCard = ({ event }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(event)}
    >
      {/* Blue line at the bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - with aspect ratio */}
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {event.featured_image ? (
            <img 
              src={event.featured_image} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=News+Event";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            </div>
          )}
        </div>
        
        {/* Featured indicator - Using blue Award icon */}
        {event.featured && (
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
            {event.title}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          {/* Mobile: Show date and location */}
          <div className="flex sm:hidden flex-col space-y-1.5">
            <p className="text-gray-600 flex items-start gap-1.5">
              <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">
                {formatEventDate(event.event_start_date, event.event_end_date)}
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-1.5">
              <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">{event.event_location || 'TBA'}</span>
            </p>
          </div>

          {/* Desktop: Show date and location */}
          <div className="hidden sm:block space-y-2">
            <p className="text-gray-600 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">
                {formatEventDate(event.event_start_date, event.event_end_date)}
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">{event.event_location || 'TBA'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  const DetailView = ({ event }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to News & Events</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image */}
        {event.featured_image && (
          <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
            <img 
              src={event.featured_image} 
              alt={event.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(event.featured_image, '_blank')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Expand button */}
            <button
              onClick={() => window.open(event.featured_image, '_blank')}
              className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-80 transition-all"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {/* Featured indicator - Blue Award icon for detail view */}
            {event.featured && (
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
        {!event.featured_image && event.featured && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white relative">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 pr-24 sm:pr-32">{event.title}</h1>
          </div>
        )}

        {/* If there is a hero image, title is in the gradient overlay */}
        {event.featured_image && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8">
          {/* Excerpt */}
          {event.excerpt && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm sm:text-base text-gray-700 italic">{event.excerpt}</p>
            </div>
          )}

          {/* Full Content */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Description</h2>
            </div>
            <div 
              className="ml-4 sm:ml-7 prose prose-blue max-w-none text-sm sm:text-base text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: event.content || event.description || 'No description available.' 
              }}
            />
          </div>

          {/* Event Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Type</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 capitalize truncate">{event.type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Category</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{event.category || 'General'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Date</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {formatEventDate(event.event_start_date, event.event_end_date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Location</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{event.event_location || 'TBA'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Gallery</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({event.gallery.length} images)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {event.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                    style={{ height: '120px', sm: { height: '180px' } }}
                    onClick={() => openGalleryModal(event.gallery, index)}
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
                          {index + 1}/{event.gallery.length}
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

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Attachments</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">({event.attachments.length} files)</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {event.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{attachment.name}</p>
                        {attachment.size && (
                          <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                      <button
                        onClick={() => downloadAttachment(attachment.url, attachment.name)}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
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

          {/* Registration Link */}
          {event.event_registration_link && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <a
                href={event.event_registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Register for this event</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Gallery Modal
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
                News & Events
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Stay updated with the latest news, training workshops, R&D participation, opportunities, and newly approved projects.
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading news and events...</p>
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
      
      {!selectedEvent && !loading && !error && (
        <>
          {/* Search Component with configuration */}
          <Search 
            className="mt-15"
            data={NewsEventsData}
            {...searchConfigs.newsEvents}
            onSearchResults={handleSearchResults}
            onSearchStart={handleSearchStart}
            onSearchClear={handleSearchClear}
          />
          
          {/* Filter Buttons */}
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by type:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['all', 'news', 'event'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={getFilterButtonStyle(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Stats */}
          {searchTerm && (
            <div className="container mx-auto px-4 mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Found {filteredAndSearchedEvents.length} results for "{searchTerm}"
                {activeFilter !== 'all' && ` in ${activeFilter} category`}
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex-grow container mx-auto px-4 mt-8">
        {selectedEvent ? (
          <>
            <DetailView event={selectedEvent} />
            <GalleryModal />
          </>
        ) : (
          <>
            {loading ? null : error ? null : (
              <>
                {filteredAndSearchedEvents.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                      {currentEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm sm:text-lg">No news or events found.</p>
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

export default NewsEvents;