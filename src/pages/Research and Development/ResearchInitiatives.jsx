import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
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
  Clock,
  Award,
  UserCircle
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

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const itemsPerPage = 9;
  const topRef = useRef(null);

  // Update filtered projects when researchInitiatives changes
  useEffect(() => {
    // Use researchInitiatives if available, otherwise use localData as fallback
    const projectsToShow = researchInitiatives && researchInitiatives.length > 0 
      ? researchInitiatives 
      : (localData || []);
    setFilteredProjects(projectsToShow);
  }, [researchInitiatives, localData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects]);

  useEffect(() => {
    if (topRef.current && !selectedProject) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedProject]);

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

  const handleCardClick = (project) => {
    setSelectedProject(project);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  const handleSearchResults = (results) => {
    setFilteredProjects(results);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
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
  };

  const getStatusBadge = (status) => {
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
  };
const ProjectCard = ({ project }) => (
  <div 
    className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    onClick={() => handleCardClick(project)}
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    
    {/* Status Badge and Featured Label */}
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
      {/* Featured Label - appears above status if featured */}
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
);

  const DetailView = ({ project }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Research Initiatives</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
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
  );

  // Loading state
  if (loading && filteredProjects.length === 0) {
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
      
      {!selectedProject && (
        <Search 
          data={filteredProjects}
          searchKeys={['title', 'description', 'funding_source', 'implementing_agency', 'project_lead', 'location']}
          onSearchResults={handleSearchResults}
          showResultCount={true}
        />
      )}

      <div className="flex-grow container mx-auto px-4">
        {selectedProject ? (
          <DetailView project={selectedProject} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">Research Initiatives</h1>
            
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No research projects found.</p>
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

export default ResearchInitiatives;