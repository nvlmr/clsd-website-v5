import React from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AquacultureStationImg from "../../assets/images/About Research Units/Aquaculture Station.jpg";

import { 
  TestTube,
  Microscope,
  Atom,
  Dna,
  DnaOff,
  CircleDot,
  Droplets,
  FlaskConical
} from "lucide-react";

function AquacultureResearchStation() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      
      {/* Main content with navbar offset */}
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        {/* Hero Section - Modern gradient design with adjusted padding */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          {/* Abstract background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                  Aquaculture Research
                </span>
                <span className="text-gray-900 font-semibold">Station</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Description Section - Modern layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
            {/* About Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-6 mt-10">
                  About the Laboratory
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              </div>
              
              <div className="space-y-5">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Aquaculture Research Station- Develop and improve farming technologies for aquatic species, 
                    pilot trials and demonstration projects, facilities for industry and researchers to carry 
                    out projects and trials, work with others towards sustainable aquaculture and fisheries, 
                    train staff and students and educate the public about aquaculture.
                </p>
              </div>
            </div>
            
            {/* Laboratory Image - Fixed for responsiveness */}
            <div className="flex items-stretch">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-gray-100">
                <img 
                  src={AquacultureStationImg} 
                  alt="Analytical Services Laboratory" 
                  className="w-full h-full object-contain lg:object-cover"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
                Our Services
              </h2>
            </div>
            
            {/* Services Grid - Modern cards with Lucide icons */}
            <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-9">
              {[
                { name: "Isolation and Purification", icon: TestTube },
                { name: "Biochemical Characterization", icon: Microscope },
                { name: "Phenotypic Characterization", icon: Atom },
                { name: "DNA Extraction", icon: Dna },
                { name: "Molecular Identification", icon: DnaOff },
                { name: "Disc Diffusion Assay", icon: CircleDot },
                { name: "Agar Dilution Assay", icon: Droplets },
                { name: "Broth Dilution Assay", icon: FlaskConical }
              ].map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                    
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-md font-semibold text-gray-800 leading-tight">
                        {service.name}
                      </h3>
                      
                      {/* Hover indicator */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AquacultureResearchStation;