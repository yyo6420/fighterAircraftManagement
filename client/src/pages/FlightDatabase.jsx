import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
// ייבוא פונקציות ה-API
import { getAllflights, getFlightsByAircraftId } from "../utills/flightsFunctions.js";
import { getAllAircrafts } from "../utills/aircraftsFunctions.js";

const allFlights = await getAllflights();

function FlightDatabase() {
  const [flights, setFlights] = useState([]);
  const [allAircrafts, setAllAircrafts] = useState(allFlights);
  const [selectedId, setSelectedId] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const flightsResponse = await getAllflights();
        const aircraftsResponse = await getAllAircrafts();

        setFlights(flightsResponse || []);
        setAllAircrafts(aircraftsResponse || []);
      } catch (error) {
        console.error("טעינת הנתונים נכשלה:", error);
      }
    };
    loadData();
  }, []);

  const handleFilter = async () => {
    if (!selectedId) {
      alert("נא לבחור מטוס מהרשימה");
      return;
    }
    try {
      const filteredResults = await getFlightsByAircraftId(selectedId);
      setFlights(filteredResults);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShowAll = async () => {
    const allFlights = await getAllflights();
    setFlights(allFlights);
    setSelectedId("");
  };

  return (
    <>
      <NavBar />
      <h1 className="title">מאגר טיסות</h1>

      <div className="tableActions">
        <div className="searchArea">
          <select
            className="searchInput"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">בחר מטוס לסינון</option>
            {allAircrafts.map(ac => (
              <option key={ac._id} value={ac._id}>
                {ac.aircraftName}
              </option>
            ))}
          </select>

          <button className="searchBtn" onClick={handleFilter}>סנן</button>
          <button className="showAllBtn" onClick={handleShowAll}>הצג הכל</button>
        </div>

        <button className="addFlightButton" onClick={() => setIsAddModalOpen(true)}>
          + תיעוד טיסה חדשה
        </button>
      </div>

      {flights.length > 0 ? (
        <Table
          columns={["מספר זיהוי של הטיסה", "מספר זיהוי של המטוס", "שעת יציאה", "שעת חזרה לבסיס", "נקודת אורך", "נקודת רוחב"]}
          rows={flights}
        />
      ) : (
        <div className="noDataMessage">
          <p>אין תיעוד של טיסות למטוס זה</p>
        </div>
      )}
    </>
  );
}

export default FlightDatabase;