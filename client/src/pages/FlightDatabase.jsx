import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { getAllflights, getFlightsByAircraftId, addNewFlight, deleteFlight } from "../utills/flightsFunctions.js";
import { getAllAircrafts } from "../utills/aircraftsFunctions.js";

function FlightDatabase() {
  const [flights, setFlights] = useState([]);
  const [allAircrafts, setAllAircrafts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
      console.error(error.message || "Failed in loading data");
    }
  };

  const filteredFlights = flights.filter(flight =>
    flight._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteFlight = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteFlight(id);
        setFlights(prev => prev.filter(flight => flight._id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const flightsColomns = [
    {
      header: "מספר זיהוי טיסה",
      key: "_id"
    },
    {
      header: "מספר זיהוי מטוס",
      key: "aircraftId"
    },
    {
      header: "שעת המראה",
      key: "takeoffTime"
    },
    {
      header: "שעת נחיתה",
      key: "landingTime"
    },
    {
      header: "אורך",
      key: "longitude"
    },
    {
      header: "רוחב",
      key: "latitude"
    }
  ]

  return (
    <>
      <NavBar />
      <h1 className="title flightDatabasetitle">מאגר טיסות</h1>

      <div className="tableActions">
        <div className="searchArea">
          <select
            className="searchInput"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">סינון לפי מטוס</option>
            {allAircrafts.map(aircraft => (
              <option key={aircraft._id} value={aircraft._id}>
                {aircraft.aircraftName}
              </option>
            ))}
          </select>
          <button className="searchBtn" onClick={handleFilter}>
            סנן
          </button>

          <span className="separator"> | </span>

          <input
            type="text"
            className="searchInput"
            placeholder="סינון לפי מספר טיסה..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button className="showAllBtn" onClick={handleShowAll}>נקה הכל</button>
        </div>

        <button className="addObjectButton" onClick={() => setIsAddModalOpen(true)}>
          + תיעוד טיסה חדשה
        </button>
      </div>

      {filteredFlights.length > 0 ? (
        <Table
          columns={flightsColomns}
          rows={filteredFlights}
          onDelete={handleDeleteFlight}
        />
      ) : (
        <div className="noDataMessage">
          <p>לא נמצאו טיסות תואמות</p>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent tactical-theme">
            <h3>הזנת נתוני טיסה חדשה</h3>
            <div className="addingForm">
              <label className="inputLabel">בחר מטוס:</label>
              <select
                className="searchInput"
                value={newFlightData.aircraftId}
                onChange={(event) => setNewFlightData({ ...newFlightData, aircraftId: event.target.value })}
                required
              >
                <option value="">בחר מטוס מהרשימה</option>
                {allAircrafts.map(aircraft => (
                  <option key={aircraft._id} value={aircraft._id}>
                    {aircraft.aircraftName} ({aircraft._id.slice(-4)})
                  </option>
                ))}
              </select>

              <label className="inputLabel">שעת המראה:</label>
              <input
                type="datetime-local"
                onChange={(event) => setNewFlightData({ ...newFlightData, takeoffTime: event.target.value })}
                required
              />

              <label className="inputLabel">שעת נחיתה (אופציונלי):</label>
              <input
                type="datetime-local"
                onChange={(event) => setNewFlightData({ ...newFlightData, landingTime: event.target.value })}
              />
              <input
                placeholder="נקודת רוחב (Latitude)"
                onChange={(event) => setNewFlightData({ ...newFlightData, latitude: event.target.value })}
              />
              <input
                placeholder="נקודת אורך (Longitude)"
                onChange={(event) => setNewFlightData({ ...newFlightData, longitude: event.target.value })}
              />
            </div>
            <div className="modalActions">
              <button className="confirmButton" onClick={handleSaveFlight}>שמור במערכת</button>
              <button className="cancelButton" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FlightDatabase;