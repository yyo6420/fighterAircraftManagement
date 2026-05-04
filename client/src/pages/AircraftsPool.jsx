import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { addNewAircraft, getAllAircrafts, deleteAircraftById } from "../utills/aircraftsFunctions.js";

function AircraftsPool() {
  const [aircrafts, setAircrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAircraftData, setNewAircraftData] = useState({
    aircraftName: '',
    aircraftType: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllAircrafts();
      setAircrafts(data);
    } catch (error) {
      console.error("Failed to fetch aircrafts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAircrafts = aircrafts.filter((aircraft) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = aircraft.aircraftName?.toLowerCase().includes(searchLower);
    const idMatch = aircraft._id?.toString().toLowerCase().includes(searchLower) ||
      aircraft.id?.toString().toLowerCase().includes(searchLower);
    return nameMatch || idMatch;
  });

  const handleSaveAircraft = async () => {
    if (!newAircraftData.aircraftName || !newAircraftData.aircraftType) {
      return alert("נא למלא את כל השדות");
    }

    try {
      await addNewAircraft(newAircraftData);
      alert("פרטי המטוס עודכנו בהצלחה :)");
      setIsAddModalOpen(false);
      setNewAircraftData({ aircraftName: '', aircraftType: '' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המטוס מהמאגר?")) return;

    try {
      await deleteAircraftById(id);
      alert("המטוס הוסר בהצלחה");
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const aircraftsColumns = [
    {
      header: "מספר זיהוי",
      key: "_id"
    },
    {
      header: "שם המטוס",
      key: "aircraftName"
    },
    {
      header: "סוג מטוס",
      key: "aircraftType"
    }]

  return (
    <>
      <NavBar />
      <h1 className="title aircraftsPoolTitle">מאגר מטוסים</h1>

      <div className="tableActions">
        <div className="searchContainer">
          <input
            type="text"
            className="searchInput"
            placeholder="חפש מטוס..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button className="addObjectButton" onClick={() => setIsAddModalOpen(true)}>
          + הוספת מטוס חדש
        </button>
      </div>

      {loading ? (
        <p className="loadinText">טוען נתונים...</p>
      ) : (
        filteredAircrafts.length > 0 ? (
          <Table
            columns={aircraftsColumns}
            rows={filteredAircrafts}
            onDelete={handleDelete}
          />
        ) : (
          <div className="noDataMessage">
            <p>לא נמצאו מטוסים תואמים</p>
          </div>
        )
      )}

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>הזנת נתוני מטוס חדש</h3>
            <div className="addingForm">
              <input
                placeholder="שם המטוס:"
                value={newAircraftData.aircraftName}
                onChange={(event) => setNewAircraftData({ ...newAircraftData, aircraftName: event.target.value })}
              />
              <input
                placeholder="סוג מטוס:"
                value={newAircraftData.aircraftType}
                onChange={(event) => setNewAircraftData({ ...newAircraftData, aircraftType: event.target.value })}
              />
            </div>
            <div className="modalActions">
              <button className="confirmButton" onClick={handleSaveAircraft}>שמור במערכת</button>
              <button className="cancelButton" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AircraftsPool;