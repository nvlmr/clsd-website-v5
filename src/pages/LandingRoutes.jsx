import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AboutResearchUnits from "./Research Units/AboutResearchUnits";
import MBML from "./Research Units/MBML";
import AnalyticalServicesLab from "./Research Units/AnalyticalServicesLab";
import FoodInnovationLab from "./Research Units/FoodInnovationLab";
import AquacultureResearchStation from "./Research Units/AquacultureResearchStation";
import GeneralFacilities from "./Research Units/GeneralFacilities";
import ClsdEquipmentList from "./Research Units/ClsdEquipmentList";

import AboutCenterForLakes from "./Research and Development/AboutCenterForLakes";
import ResearchTeam from "./Research and Development/ResearchTeam";
import ClsdProject from "./Research and Development/ClsdProject";
import ClsdResearchPaper from "./Research and Development/ClsdResearchPaper";
import PDL from "./Research and Development/PLD";

import AboutScienceAndResearch from "./Science and Research/AboutS&R";
import DostFundedProject from "./Science and Research/DostFundedProject";

import IEC_Materials from "./Media/IEC_Materials";
import VideoGallery from "./Media/VideoGallery";

import Calendar from "./Calendar/Calendar";
import Contact from "./Contact/Contact";
import Esentry from "./E-Sentry/E-sentry";

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