// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\LandingRoutes.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./HomePage.jsx";

import MBML from "./Research Units/MBML.jsx";
import AnalyticalIntrumentation from "./Research Units/AnalyticalInstrumentation.jsx";
import FoodInnovation from "./Research Units/FoodInnovation.jsx";
import AquacultureResearchStation from "./Research Units/AquacultureResearchStation.jsx";
import GeneralFacilities from "./Research Units/GeneralFacilities.jsx";
import ClsdEquipment from "./Research Units/ClsdEquipment.jsx";

import AboutCenterForLakes from "./Research and Development/AboutCenterForLakes.jsx";
import OrganizationalStructure from "./Research and Development/OrganizationalStructure.jsx";
import ResearchInitiatives from "./Research and Development/ResearchInitiatives.jsx";
import ResearchPaper from "./Research and Development/ResearchPaper.jsx";
import PDL from "./Research and Development/PLD.jsx";
import SearchEngine from "./Research and Development/SearchEngine.jsx";

import AboutScienceAndResearch from "./Collaborative Research/AboutS&R.jsx";
import DostFundedProject from "./Collaborative Research/DostFundedProject.jsx";
import Esentry from "./Collaborative Research/E-sentry.jsx";

import IEC_Materials from "./Media/IEC_Materials.jsx";
import VideoGallery from "./Media/VideoGallery.jsx";

import NewsEvents from "./News & Events/NewsEvents.jsx";

import { ChatProvider } from '../context/ChatContext.jsx';
import ChatBot from '../components/chatBot.jsx';

function LandingRoutes() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/MBML" element={<MBML />} />
        <Route path="/AnalyticalIntrumentation" element={<AnalyticalIntrumentation />} />
        <Route path="/FoodInnovation" element={<FoodInnovation />} />
        <Route path="/AquacultureResearchStation" element={<AquacultureResearchStation />} />
        <Route path="/GeneralFacilities" element={<GeneralFacilities />} />
        <Route path="/ClsdEquipment" element={<ClsdEquipment />} />

        <Route path="/AboutCenterForLakes" element={<AboutCenterForLakes />} />
        <Route path="/OrganizationalStructure" element={<OrganizationalStructure />} />
        <Route path="/ResearchInitiatives" element={<ResearchInitiatives />} />
        <Route path="/ResearchPaper" element={<ResearchPaper />} />
        <Route path="/PDL" element={<PDL />} />
        <Route path="/SearchEngine" element={<SearchEngine />} />

        <Route path="/AboutS&R" element={<AboutScienceAndResearch />} />
        <Route path="/DostFundedProject" element={<DostFundedProject />} />
        <Route path="/IEC_Materials" element={<IEC_Materials />} />

        <Route path="/VideoGallery" element={<VideoGallery />} />
        <Route path="/E-sentry" element={<Esentry />} />

        <Route path="/NewsEvents" element={<NewsEvents />} />
      </Routes>
      <ChatBot />
    </ChatProvider>
  );
}

export default LandingRoutes;