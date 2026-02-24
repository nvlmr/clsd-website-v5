import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingRoutes from "./pages/LandingRoutes";

function App() {
  return (
    <Router>
      <LandingRoutes />
    </Router>
  );
}

export default App;