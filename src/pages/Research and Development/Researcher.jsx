import React, { useState } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../AutoScroll.jsx";
import experts from "../../data/ResearchTeam.js";
import { ChevronLeft, ChevronRight, GraduationCap, Award, Building2 } from "lucide-react";

function Researcher() {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const ResearcherCard = ({ person }) => (
    <div 
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[200px] sm:max-w-[280px] mx-auto overflow-hidden cursor-pointer"
      onClick={() => setSelectedPerson(person)}
    >
      {/* Simple top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"></div>
      
      {/* Main content */}
      <div className="p-3 sm:p-5 flex flex-col h-full">
        {/* Image and name section - takes most of the space */}
        <div className="flex-grow">
          {/* Image with simple styling */}
          <div className="relative mb-2 sm:mb-3 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
          
          {/* Name */}
          <h3 className="text-center text-gray-900 font-bold text-sm sm:text-lg md:text-xl mb-0.5 sm:mb-1">
            {person.name}
          </h3>
          
          {/* Title */}
          <p className="text-center text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
            {person.title}
          </p>
        </div>
        
        {/* View Profile at bottom left */}
        <div className="flex justify-start mt-1 sm:mt-2">
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-blue-600 text-[10px] sm:text-xs md:text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Profile
            <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );

  const DetailView = ({ person }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => setSelectedPerson(null)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span>Back to Research Team</span>
      </button>

      {/* Detail card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Header with blue gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img 
              src={person.image} 
              alt={person.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{person.name}</h1>
              <p className="text-xl text-blue-100 mt-1">{person.title}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  {person.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Qualifications */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Qualifications</h2>
            </div>
            <p className="text-gray-700 ml-7">{person.qualifications}</p>
          </div>

          {/* Expertise */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Expertise</h2>
            </div>
            <p className="text-gray-700 ml-7">{person.expertise}</p>
          </div>

          {/* Institution (if available) */}
          {person.institution && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Institution</h2>
              </div>
              <p className="text-gray-700 ml-7">{person.institution}</p>
            </div>
          )}

          {/* Bio if available */}
          {person.bio && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Biography</h2>
              <p className="text-gray-700">{person.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                  Research Team
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
                Meet our dedicated team of researchers and experts driving innovation and excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Conditional rendering: List View or Detail View */}
        {selectedPerson ? (
          <DetailView person={selectedPerson} />
        ) : (
          /* Research Team Grid */
          <section className="py-8 sm:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Group by role with headers */}
              {['Director', 'Unit Head', 'Researcher', 'Affiliate Scientist', 'Research Assistant' ].map((role) => {
                const roleExperts = experts.filter(person => person.role === role);
                if (roleExperts.length === 0) return null;
                
                // Responsive grid with centered cards for small counts
                const getGridClasses = (count) => {
                  const baseClasses = 'grid gap-3 sm:gap-4';
                  
                  if (count === 1) {
                    return `${baseClasses} grid-cols-1 flex justify-center`;
                  }
                  if (count === 2) {
                    return `${baseClasses} grid-cols-2 max-w-2xl mx-auto`;
                  }
                  if (count === 3) {
                    return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto`;
                  }
                  return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
                };

                return (
                  <div key={role} className="mb-8 sm:mb-10 last:mb-0">
                    {/* Section header */}
                    <div className="flex items-center mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {role}
                      </h2>
                      <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                      <span className="ml-3 text-xs sm:text-sm text-gray-500">
                        {roleExperts.length}
                      </span>
                    </div>
                    
                    <div className={getGridClasses(roleExperts.length)}>
                      {roleExperts.map((person) => (
                        <div key={person.id} className="flex justify-center">
                          <ResearcherCard person={person} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Researcher;