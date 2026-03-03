import React, { useState, useEffect } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../AutoScroll.jsx";

// Equipment images imports
import miniCentrifuge from "../../assets/images/Equipments/mini centrifuge.jpg";
import multiParameter from "../../assets/images/Equipments/multi parameter.jpg";
import photometer from "../../assets/images/Equipments/photometer.jpg";
import reciprocalShaker from "../../assets/images/Equipments/Reciprocal shaker.jpg";
import rotaryEvaporator from "../../assets/images/Equipments/rotary evaporator.jpg";
import spectroPhotometer from "../../assets/images/Equipments/spectro photometer.jpg";
import thermoShaker from "../../assets/images/Equipments/thermo shaker.jpg";
import trinocularMicroscope from "../../assets/images/Equipments/trinocular microscope.jpg";
import uvVisSpectrophotometer from "../../assets/images/Equipments/UV VIS spectrophotometer.jpg";
import vanDorn from "../../assets/images/Equipments/van dorn.jpg";
import waterBath from "../../assets/images/Equipments/water bath.jpg";
import waterPurificationSystem from "../../assets/images/Equipments/water purification system.jpg";
import xrf from "../../assets/images/Equipments/xrf.jpg";
import analyticalWeighingScale from "../../assets/images/Equipments/analytical digital weighing scale.jpg";
import autoclave from "../../assets/images/Equipments/autoclave.jpg";
import benchtopCentrifuge from "../../assets/images/Equipments/benchtop centrifuge.jpg";
import bioFreezer from "../../assets/images/Equipments/bio-freezer.jpg";
import convectionOven from "../../assets/images/Equipments/convection oven.jpg";
import conventionalPCR from "../../assets/images/Equipments/conventional pcr.jpg";
import drone from "../../assets/images/Equipments/drone.jpg";
import exo1MultiParameterSonde from "../../assets/images/Equipments/EXO1 Multi-Parameter Sonde(CTD).jpg";
import freezeDryer from "../../assets/images/Equipments/freeze dryer.jpg";
import fumeHood from "../../assets/images/Equipments/fume hood.jpg";
import furnace from "../../assets/images/Equipments/furnace.jpg";
import hplc from "../../assets/images/Equipments/hplc.jpg";
import hybridCentrifuge from "../../assets/images/Equipments/hybrid centrifuge.jpg";
import incubator from "../../assets/images/Equipments/incubator.jpg";
import ionChrom from "../../assets/images/Equipments/ion-chrom.jpg";
import laminarFlowHood from "../../assets/images/Equipments/laminar flow hood.jpg";
import microplateReader from "../../assets/images/Equipments/microplate reader.jpg";

function ClsdEquipmentList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // Responsive items per page
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 6 : 8; // 2×3=6 on mobile, 4×2=8 on desktop
    }
    return 8; // Default for SSR
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Equipment data array with descriptions
  const equipmentData = [
    { 
      name: "Mini Centrifuge", 
      image: miniCentrifuge,
      description: "Compact laboratory device used for rapid separation of fluids based on density. Ideal for clinical and research applications requiring quick spin-down of samples."
    },
    { 
      name: "Multi Parameter", 
      image: multiParameter,
      description: "Advanced water quality monitoring system that measures multiple parameters simultaneously including pH, conductivity, dissolved oxygen, and temperature."
    },
    { 
      name: "Photometer", 
      image: photometer,
      description: "Precision instrument for measuring light intensity and chemical concentrations through colorimetric analysis. Essential for water quality testing and chemical analysis."
    },
    { 
      name: "Reciprocal Shaker", 
      image: reciprocalShaker,
      description: "Laboratory equipment providing consistent horizontal shaking motion for mixing, dissolving, and suspending samples in various containers."
    },
    { 
      name: "Rotary Evaporator", 
      image: rotaryEvaporator,
      description: "Efficient solvent removal system that uses vacuum distillation to gently concentrate or purify chemical samples at reduced pressures."
    },
    { 
      name: "Spectro Photometer", 
      image: spectroPhotometer,
      description: "Analytical instrument measuring light intensity across wavelengths to determine concentration of chemical substances in solutions."
    },
    { 
      name: "Thermo Shaker", 
      image: thermoShaker,
      description: "Combined heating and shaking device for precise temperature control during sample incubation and mixing processes."
    },
    { 
      name: "Trinocular Microscope", 
      image: trinocularMicroscope,
      description: "Advanced microscope with three eyepiece tubes allowing simultaneous observation, photography, and video recording of specimens."
    },
    { 
      name: "UV VIS Spectrophotometer", 
      image: uvVisSpectrophotometer,
      description: "High-precision instrument for measuring light absorption in ultraviolet and visible ranges, crucial for quantitative chemical analysis."
    },
    { 
      name: "Van Dorn", 
      image: vanDorn,
      description: "Horizontal water sampling bottle designed for collecting water samples at specific depths without contamination from other depths."
    },
    { 
      name: "Water Bath", 
      image: waterBath,
      description: "Temperature-controlled water bath for incubating samples, thawing materials, and conducting temperature-sensitive experiments."
    },
    { 
      name: "Water Purification System", 
      image: waterPurificationSystem,
      description: "Multi-stage filtration system producing high-purity water for sensitive laboratory applications and analytical procedures."
    },
    { 
      name: "XRF", 
      image: xrf,
      description: "X-Ray Fluorescence spectrometer for non-destructive elemental analysis of materials, from solids to liquids and powders."
    },
    { 
      name: "Analytical Weighing Scale", 
      image: analyticalWeighingScale,
      description: "High-precision balance with microgram sensitivity for accurate measurement of small sample masses in analytical chemistry."
    },
    { 
      name: "Autoclave", 
      image: autoclave,
      description: "Sterilization equipment using high-pressure steam to eliminate microorganisms from laboratory instruments and media."
    },
    { 
      name: "Benchtop Centrifuge", 
      image: benchtopCentrifuge,
      description: "Compact centrifugal separator for rapid sedimentation of cellular components, proteins, and nucleic acids."
    },
    { 
      name: "Bio-Freezer", 
      image: bioFreezer,
      description: "Ultra-low temperature freezer for long-term storage of biological samples, enzymes, and temperature-sensitive reagents."
    },
    { 
      name: "Convection Oven", 
      image: convectionOven,
      description: "Laboratory oven with forced air circulation for uniform heating, drying, and sterilization of glassware and samples."
    },
    { 
      name: "Conventional PCR", 
      image: conventionalPCR,
      description: "Polymerase Chain Reaction thermal cycler for DNA amplification, genetic analysis, and molecular biology research."
    },
    { 
      name: "Drone", 
      image: drone,
      description: "Unmanned aerial vehicle equipped with sensors for environmental monitoring, lake surveying, and aerial imaging."
    },
    { 
      name: "EXO1 Multi-Parameter Sonde", 
      image: exo1MultiParameterSonde,
      description: "Advanced water quality monitoring platform with multiple sensors for real-time environmental data collection."
    },
    { 
      name: "Freeze Dryer", 
      image: freezeDryer,
      description: "Lyophilization system for preserving biological materials by removing water through sublimation under vacuum."
    },
    { 
      name: "Fume Hood", 
      image: fumeHood,
      description: "Ventilated enclosure for safely handling hazardous chemicals, containing fumes and protecting laboratory personnel."
    },
    { 
      name: "Furnace", 
      image: furnace,
      description: "High-temperature laboratory furnace for ashing samples, heat treatment, and material testing up to 1200°C."
    },
    { 
      name: "HPLC", 
      image: hplc,
      description: "High-Performance Liquid Chromatography system for separating, identifying, and quantifying compounds in complex mixtures."
    },
    { 
      name: "Hybrid Centrifuge", 
      image: hybridCentrifuge,
      description: "Versatile centrifuge combining refrigeration and multiple rotor options for various separation applications."
    },
    { 
      name: "Incubator", 
      image: incubator,
      description: "Temperature-controlled chamber for cultivating microorganisms, cell cultures, and maintaining biological samples."
    },
    { 
      name: "Ion Chromatography", 
      image: ionChrom,
      description: "Analytical system for separating and quantifying ions in solution, essential for water quality and environmental analysis."
    },
    { 
      name: "Laminar Flow Hood", 
      image: laminarFlowHood,
      description: "Sterile workbench providing particle-free workspace for handling sensitive biological samples and cell cultures."
    },
    { 
      name: "Microplate Reader", 
      image: microplateReader,
      description: "Multi-well plate analyzer for high-throughput screening, ELISA assays, and various photometric measurements."
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = equipmentData.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    // Removed window.scrollTo to prevent scrolling to top
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    // Removed window.scrollTo to prevent scrolling to top
  };

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedEquipment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl tracking-tight">
                <span className="text-gray-900 font-semibold">Available </span>
                <span className="text-blue-500 font-semibold">Equipment</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!selectedEquipment ? (
            /* Equipment Grid View */
            <div className="w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentItems.map((equipment, index) => (
                  <div
                    key={index}
                    onClick={() => handleEquipmentClick(equipment)}
                    className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col"
                  >
                    {/* Fixed size image container with exact dimensions */}
                    <div className="w-full pt-[100%] relative bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {/* Fixed height text container */}
                    <div className="p-3 sm:p-4 h-16 sm:h-20 flex items-center justify-center border-t border-gray-100">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {equipment.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page numbers - hide on very small screens if too many */}
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
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Equipment Detail View */
            <div className="w-full max-w-4xl mx-auto animate-fadeIn">
              {/* Back Button */}
              <button
                onClick={handleBackClick}
                className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Equipment List
              </button>

              {/* Equipment Detail Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section - Fixed size container */}
                  <div className="lg:w-1/2 bg-gray-100">
                    <div className="w-full pt-[75%] lg:pt-[100%] relative">
                      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                        <img
                          src={selectedEquipment.image}
                          alt={selectedEquipment.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="lg:w-1/2 p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                      {selectedEquipment.name}
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                          Description
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {selectedEquipment.description}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-semibold text-blue-800 mb-3">
                          Applications
                        </h3>
                        <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Research & Development
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Quality Control
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Environmental Monitoring
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Sample Analysis
                          </li>
                        </ul>
                      </div>

                      {/* Additional Equipment Info */}
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs sm:text-sm text-gray-500">
                          For more information about this equipment or to schedule its use, 
                          please contact our laboratory staff.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClsdEquipmentList;