import AircraftsPool from './pages/AircraftsPool.jsx';
import AircraftsTypes from './pages/AircraftsTypes.jsx';
import FlightDatabase from './pages/FlightDatabase.jsx';
import HomePage from './pages/HomePage.jsx';
import './styles/App.css';
import { Routes, Route } from "react-router";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aircraftsPool" element={<AircraftsPool />} />
        <Route path="/aircraftsTypes" element={<AircraftsTypes />} />
        <Route path="/flightDatabase" element={<FlightDatabase />} />
      </Routes>
    </>
  )
}

export default App
