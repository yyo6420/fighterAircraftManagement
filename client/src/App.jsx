import AircraftsPool from './pages/AircraftsPool.jsx';
import AircraftsTypes from './pages/AircraftsTypes.jsx';
import FlightDatabase from './pages/FlightDatabase.jsx';
import Map from "./pages/Map.jsx"
import HomePage from './pages/HomePage.jsx';
import './styles/App.css';
import "./styles/Map.css"
import { Routes, Route } from "react-router";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aircraftsPool" element={<AircraftsPool />} />
        <Route path="/aircraftsTypes" element={<AircraftsTypes />} />
        <Route path="/flightDatabase" element={<FlightDatabase />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </>
  )
}

export default App
