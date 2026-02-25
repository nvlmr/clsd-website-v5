import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./HomePage.jsx";
import AboutResearchUnits from "./Research Units/AboutResearchUnits.jsx";
import MBML from "./Research Units/MBML.jsx";
import AnalyticalServicesLab from "./Research Units/AnalyticalServicesLab.jsx";
import FoodInnovationLab from "./Research Units/FoodInnovationLab.jsx";
import AquacultureResearchStation from "./Research Units/AquacultureResearchStation.jsx";
import GeneralFacilities from "./Research Units/GeneralFacilities.jsx";
import ClsdEquipmentList from "./Research Units/ClsdEquipmentList.jsx";

import AboutCenterForLakes from "./Research and Development/AboutCenterForLakes.jsx";
import ResearchTeam from "./Research and Development/ResearchTeam.jsx";
import ClsdProject from "./Research and Development/ClsdProject.jsx";
import ClsdResearchPaper from "./Research and Development/ClsdResearchPaper.jsx";
import PDL from "./Research and Development/PLD.jsx";

import AboutScienceAndResearch from "./Science and Research/AboutS&R.jsx";
import DostFundedProject from "./Science and Research/DostFundedProject.jsx";

import IEC_Materials from "./Media/IEC_Materials.jsx";
import VideoGallery from "./Media/VideoGallery.jsx";

import Calendar from "./Calendar/Calendar.jsx";
import Contact from "./Contact/Contact.jsx";
import Esentry from "./E-Sentry/E-sentry.jsx";

function LandingRoutes () {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutResearchUnits" element={<AboutResearchUnits />} />
        <Route path="/MBML" element={<MBML />} />
        <Route path="/AnalyticalServicesLab" element={<AnalyticalServicesLab />} />
        <Route path="/FoodInnovationLab" element={<FoodInnovationLab />} />
        <Route path="/AquacultureResearchStation" element={<AquacultureResearchStation />} />
        <Route path="/GeneralFacilities" element={<GeneralFacilities />} />
        <Route path="/ClsdEquipmentList" element={<ClsdEquipmentList />} />
        <Route path="/AboutCenterForLakes" element={<AboutCenterForLakes />} />
        <Route path="/ResearchTeam" element={<ResearchTeam />} />
        <Route path="/ClsdProject" element={<ClsdProject />} />
        <Route path="/ClsdResearchPaper" element={<ClsdResearchPaper />} />
        <Route path="/PDL" element={<PDL />} />
        <Route path="/AboutS&R" element={<AboutScienceAndResearch/>} />
        <Route path="/DostFundedProject" element={<DostFundedProject/>} />
        <Route path="/IEC_Materials" element={<IEC_Materials/>} />
        <Route path="/VideoGallery" element={<VideoGallery/>} />
        <Route path="/Contact" element={<Contact/>} />
        <Route path="/Calendar" element={<Calendar/>} />
        <Route path="/E-sentry" element={<Esentry/>} />
    </Routes>
  );
}

export default LandingRoutes;