import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { typesData, addNewType } from "../utills/aircaftsTypesFunctons.js";

function AircraftsTypes() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    typeName: '',
    maxSpeed: '',
    fuelCapacity: ''
  });

  const refreshData = () => {
    window.location.reload();
  };

  const handleSaveType = async () => {
    try {
      await addNewType(newTypeData);
      alert("סוג המטוס נוסף בהצלחה :)");
      setIsAddModalOpen(false);
      refreshData();
      setNewTypeData({ typeName: '', maxSpeed: '', fuelCapacity: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <h1 className="title aircraftsTypesTitle">
        סוגי מטוסים
      </h1>

      <Table
        columns={["מספר זיהוי", "שם הדגם", "מהירות מקסימלית", "קיבולת דלק"]}
        rows={typesData}
      />

      <div className="tableActions">
        <button className="addFlightButton" onClick={() => setIsAddModalOpen(true)}>
          + הוספת סוג מטוס חדש
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>הוספת סוג מטוס חדש</h3>
            <div className="addFlightForm">
              <input
                placeholder="שם הדגם:"
                value={newTypeData.typeName}
                onChange={(event) => setNewTypeData({ ...newTypeData, typeName: event.target.value })}
                required
              />
              <input
                placeholder="מהירות מקסימלית (קמ''ש)"
                type="number"
                value={newTypeData.maxSpeed}
                onChange={(event) => setNewTypeData({ ...newTypeData, maxSpeed: event.target.value })}
                required
              />
              <input
                placeholder="קיבולת דלק (ליטרים)"
                type="number"
                value={newTypeData.fuelCapacity}
                onChange={(event) => setNewTypeData({ ...newTypeData, fuelCapacity: event.target.value })}
                required
              />
            </div>
            <div className="modalActions">
              <button className="confirmBtn" onClick={handleSaveType}>שמור במערכת</button>
              <button className="cancelBtn" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AircraftsTypes;