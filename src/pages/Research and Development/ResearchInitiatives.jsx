import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../../components/Search.jsx";
import researchInitiatives from "../../data/ResearchInitiatives.js";
import { ChevronLeft, ChevronRight, Calendar, Building2, Landmark, FileText, ArrowLeft } from "lucide-react";

function ResearchInitiatives() {
  const [filteredProjects, setFilteredProjects] = useState(researchInitiatives);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const itemsPerPage = 9;
  const topRef = useRef(null);

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

  const ProjectCard = ({ project }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(project)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {project.title}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">Duration:</span> {project.duration}
              </span>
            </p>
            <p className="text-gray-600 flex items-start gap-2">
              <Landmark className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">Funding Agency:</span> {project.fundingAgency}
              </span>
            </p>
            <p className="text-gray-600 flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">Implementing Agency:</span> {project.implementingAgency}
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
              <Calendar className="w-4 h-4" />
              {project.duration}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Funding Agency</h2>
            </div>
            <p className="text-gray-700 ml-7">{project.fundingAgency}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Implementing Agency</h2>
            </div>
            <p className="text-gray-700 ml-7">{project.implementingAgency}</p>
          </div>

          {project.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Project Description</h2>
              </div>
              <p className="text-gray-700 ml-7 leading-relaxed">{project.description}</p>
            </div>
          )}

          {project.objectives && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Objectives</h2>
              </div>
              {Array.isArray(project.objectives) ? (
                <ul className="list-disc list-inside ml-7 space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 ml-7">{project.objectives}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          data={researchInitiatives}
          searchKeys={['title', 'fundingAgency', 'implementingAgency']}
          onSearchResults={setFilteredProjects}
          showResultCount={true}
        />
      )}

      <div className="flex-grow container mx-auto px-4">
        {selectedProject ? (
          <DetailView project={selectedProject} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">Research Units</h1>
            
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