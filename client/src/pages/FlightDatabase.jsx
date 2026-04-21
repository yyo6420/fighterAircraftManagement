import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { flightsData } from "../utills/flightsFunctions.js";
import { addNewFlight } from "../utills/flightsFunctions.js";

function FlightDatabase() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFlightData, setNewFlightData] = useState({
    id: '',
    takeoffTime: '',
    latitude: '',
    longitude: '',
    landingTime: null
  });

  const refreshData = () => {
    window.location.reload();
  };

  const handleSaveFlight = async () => {
    try {
      await addNewFlight(newFlightData);
      alert("פרטי הטיסה עודכנו בהצלחה :)");
      setIsAddModalOpen(false);
      refreshData();
      setNewFlightData({ id: '', takeoffTime: '', latitude: '', longitude: '', landingTime: null });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <h1 className="title flightDatabasetitle">
        מאגר טיסות
      </h1>

      <Table
        columns={["מספר זיהוי של הטיסה", "מספר זיהוי של המטוס", "שעת יציאה", "שעת חזרה לבסיס", "נקודת אורך של היעד", "נקודת רוחב של היעד"]}
        rows={flightsData}
      />

      <div className="tableActions">
        <button className="addFlightButton" onClick={() => setIsAddModalOpen(true)}>
          + תיעוד טיסה חדשה
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>הזנת נתוני טיסה</h3>
            <div className="addFlightForm">
              <input
                placeholder="מספר זיהוי מטוס"
                onChange={(event) => setNewFlightData({ ...newFlightData, id: event.target.value })}
                required
              />
              <label className="inputLabel">שעת המראה:</label>
              <input
                type="datetime-local"
                placeholder="שעת המראה"
                onChange={(event) => setNewFlightData({ ...newFlightData, takeoffTime: event.target.value })}
                required
              />
              <label className="inputLabel">שעת נחיתה (אופציונלי):</label>
              <input
                type="datetime-local"
                placeholder="שעת נחיתה (אופציונלי)"
                onChange={(event) => setNewFlightData({ ...newFlightData, landingTime: event.target.value })}
              />


              <input
                placeholder="נקודת אורך (Longitude)"
                onChange={(event) => setNewFlightData({ ...newFlightData, longitude: event.target.value })}
                required
              />
              <input
                placeholder="נקודת רוחב (Latitude)"
                onChange={(event) => setNewFlightData({ ...newFlightData, latitude: event.target.value })}
                required
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