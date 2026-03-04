import React from "react";
import NavBar from "../../navigation/NavBar.jsx";
import AutoScroll from "../AutoScroll.jsx";
import Footer from "../../navigation/Footer.jsx";
import Search from "../Search.jsx";
import researchInitiatives from "../../data/ResearchInitiatives.js";

function ClsdProject() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      <Search />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Research Units</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchInitiatives.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  {project.title}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Duration:</span> {project.duration}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Funding Agency:</span> {project.fundingAgency}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Implementing Agency:</span> {project.implementingAgency}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ClsdProject;