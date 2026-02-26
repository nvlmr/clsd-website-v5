import React from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";

function AboutResearchUnits() {
  const researchFacilities = [
    {
      name: "Molecular Laboratory",
      description: "State-of-the-art facility for DNA analysis, PCR, and molecular research applications.",
      image: "/images/molecular-lab.jpg" // Replace with actual image path
    },
    {
      name: "Analytical Laboratory",
      description: "Equipped with advanced instruments for chemical analysis and material testing.",
      image: "/images/analytical-lab.jpg" // Replace with actual image path
    },
    {
      name: "Food Innovation Laboratory",
      description: "Dedicated space for food product development, testing, and quality analysis.",
      image: "/images/food-innovation.jpg" // Replace with actual image path
    },
    {
      name: "Aquaculture Station",
      description: "Research facility for aquatic species cultivation and marine biology studies.",
      image: "/images/aquaculture.jpg" // Replace with actual image path
    },
    {
      name: "General Facility Station",
      description: "Multi-purpose laboratory space for various scientific experiments and research.",
      image: "/images/general-facility.jpg" // Replace with actual image path
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavBar />
      
      {/* Hero Section with Modern Design */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight mt-10">
              About Research Units
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-6 sm:h-8 lg:h-12 text-white" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="currentColor">
            <path d="M0,0 C480,74 960,74 1440,0 L1440,74 L0,74 L0,0 Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* History Section with Modern Card Design */}
        <section className="max-w-5xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
            <div className="p-6 sm:p-8 lg:p-10">
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-base sm:text-lg">
                  The Science Research Laboratory (SRL) of the Laguna State Polytechnic University - Los Baños Campus (LSPU-LBC) was first established in early 2014 as the Science Laboratory Annex Building of the College of Fisheries (COF), originally designed for instruction purposes.
                </p>
                
                <p className="text-base sm:text-lg">
                  With support from the former University President, Dr. Nestor M. De Vera, and the former Campus Director (LSPU-LB), Dr. Daniel D. Bunal, the plans to develop this laboratory facility into a science research complex was then approved through the initiative of Prof. Christian Paul P. de la Cruz, who served as the founding Station Manager.
                </p>
                <p className="text-base sm:text-lg">
                  In 2015, some basic laboratory wares and simple equipment commonly used in science classes were acquired, in support of its original function as a teaching laboratory.
                </p>
                <p className="text-base sm:text-lg">
                  In the same year, the Atomic Absorption Spectrometer (AAS) was acquired as SRL's very first research instrument.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Grid with Modern Cards */}
        <section className="">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Our Research Facilities
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {researchFacilities.map((facility, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Image Container with Overlay */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200?text=Laboratory+Image";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    Featured
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    {facility.description}
                  </p>
                  <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group/btn">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutResearchUnits;