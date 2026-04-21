import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { addNewAircraft, getAllAircrafts } from "../utills/aircraftsFunctions.js";

const aircraftsData = await getAllAircrafts()
function AircraftsPool() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAircraftData, setNewAircraftData] = useState({
    aircraftName: '',
    aircraftType: ''
  });

  const refreshData = () => {
    window.location.reload();
  };

  const handleSaveAircraft = async () => {
    try {
      await addNewAircraft(newAircraftData);
      alert("פרטי המטוס עודכנו בהצלחה :)");
      setIsAddModalOpen(false);
      refreshData();
      setNewAircraftData({ aircraftName: '', aircraftType: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <h1 className="title aircraftsPoolTitle">
        מאגר מטוסים
      </h1>

      <Table
        columns={["מספר זיהוי", "שם המטוס", "סוג מטוס"]}
        rows={aircraftsData}
      />

      <div className="tableActions">
        <button className="addFlightButton" onClick={() => setIsAddModalOpen(true)}>
          + הוספת מטוס חדש
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>הזנת נתוני מטוס חדש</h3>
            <div className="addFlightForm">
              <input
                placeholder="שם המטוס:"
                value={newAircraftData.aircraftName}
                onChange={(event) => setNewAircraftData({ ...newAircraftData, aircraftName: event.target.value })}
                required
              />
              <input
                placeholder="סוג מטוס:"
                value={newAircraftData.aircraftType}
                onChange={(event) => setNewAircraftData({ ...newAircraftData, aircraftType: event.target.value })}
                required
              />
            </div>
            <div className="modalActions">
              <button className="confirmBtn" onClick={handleSaveAircraft}>שמור במערכת</button>
              <button className="cancelBtn" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AircraftsPool;