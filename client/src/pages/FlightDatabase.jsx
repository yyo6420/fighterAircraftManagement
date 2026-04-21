import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { getAllflights, getFlightsByAircraftId, addNewFlight } from "../utills/flightsFunctions.js";
import { getAllAircrafts } from "../utills/aircraftsFunctions.js";

function FlightDatabase() {
  const [flights, setFlights] = useState([]);
  const [allAircrafts, setAllAircrafts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFlightData, setNewFlightData] = useState({
    aircraftId: '',
    takeoffTime: '',
    latitude: '',
    longitude: '',
    landingTime: ''
  });

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

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveFlight = async () => {
    try {
      if (!newFlightData.aircraftId || !newFlightData.takeoffTime) {
        alert("נא למלא שדות חובה (מזהה מטוס ושעת המראה)");
        return;
      }
      await addNewFlight(newFlightData);
      alert("הטיסה תועדה בהצלחה!");
      setIsAddModalOpen(false);
      setNewFlightData({ aircraftId: '', takeoffTime: '', latitude: '', longitude: '', landingTime: '' });
      loadData();
    } catch (error) {
      alert("שגיאה בשמירת הטיסה: " + error.message);
    }
  };

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
    await loadData();
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
            <option value="">סינון לפי מטוס</option>
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
          columns={["ID טיסה", "ID מטוס", "המראה", "נחיתה", "אורך", "רוחב"]}
          rows={flights}
        />
      ) : (
        <div className="noDataMessage">
          <p>אין תיעוד של טיסות למטוס זה</p>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent tactical-theme">
            <h3>הזנת נתוני טיסה חדשה</h3>
            <div className="addFlightForm">
              <input
                placeholder="מזהה מטוס (ID)"
                value={newFlightData.aircraftId}
                onChange={(e) => setNewFlightData({ ...newFlightData, aircraftId: e.target.value })}
              />
              <label>שעת המראה:</label>
              <input
                type="datetime-local"
                onChange={(e) => setNewFlightData({ ...newFlightData, takeoffTime: e.target.value })}
              />
              <label>שעת נחיתה (אופציונלי):</label>
              <input
                type="datetime-local"
                onChange={(e) => setNewFlightData({ ...newFlightData, landingTime: e.target.value })}
              />
              <input
                placeholder="נקודת אורך (Longitude)"
                onChange={(e) => setNewFlightData({ ...newFlightData, longitude: e.target.value })}
              />
              <input
                placeholder="נקודת רוחב (Latitude)"
                onChange={(e) => setNewFlightData({ ...newFlightData, latitude: e.target.value })}
              />
            </div>
            <div className="modalActions">
              <button className="confirmBtn" onClick={handleSaveFlight}>שמור במערכת</button>
              <button className="cancelBtn" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FlightDatabase;