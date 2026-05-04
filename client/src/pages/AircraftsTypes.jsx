import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import { getAllTypes, addNewType, deleteTypeFromApi } from "../utills/aircaftsTypesFunctons.js";

function AircraftsTypes() {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    typeName: '',
    maxSpeed: '',
    fuelCapacity: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllTypes();
      setTypes(data || []);
    } catch (error) {
      console.error("Error loading types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteType = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את סוג המטוס הזה?")) return;

    try {
      await deleteTypeFromApi(id);
      alert("סוג המטוס נמחק בהצלחה");
      fetchData();
    } catch (error) {
      alert("שגיאה במחיקה: " + error.message);
    }
  };

  const filteredTypes = types.filter((type) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = type.typeName?.toLowerCase().includes(searchLower);
    const idMatch = type._id?.toString().toLowerCase().includes(searchLower);

    return nameMatch || idMatch;
  });

  const handleSaveType = async () => {
    if (!newTypeData.typeName || !newTypeData.maxSpeed || !newTypeData.fuelCapacity) {
      return alert("נא למלא את כל השדות");
    }

    try {
      await addNewType(newTypeData);
      alert("סוג המטוס נוסף בהצלחה :)");
      setIsAddModalOpen(false);
      setNewTypeData({ typeName: '', maxSpeed: '', fuelCapacity: '' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const typesColumns = [
    {
      header: "מספר זיהוי",
      key: "_id"
    },
    , {
      header: "שם הדגם",
      key: "typeName"
    },
    {
      header: "מהירות מקסימלית",
      key: "maxSpeedKph"
    }, {
      header: "קיבולת דלק",
      key: "fuelCapacityLiters"
    }
  ]

  return (
    <>
      <NavBar />
      <h1 className="title aircraftsTypesTitle">סוגי מטוסים</h1>

      <div className="tableActions">
        <div className="searchContainer">
          <input
            type="text"
            className="searchInput"
            placeholder="חפש דגם..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button className="addObjectButton" onClick={() => setIsAddModalOpen(true)}>
          + הוספת סוג מטוס חדש
        </button>
      </div>

      {loading ? (
        <p className="loadinText">טוען נתונים...</p>
      ) : (
        filteredTypes.length > 0 ? (
          <Table
            columns={typesColumns}
            rows={filteredTypes}
            onDelete={handleDeleteType}
          />
        ) : (
          <div className="noDataMessage">
            <p>לא נמצאו סוגי מטוסים תואמים</p>
          </div>
        )
      )}

      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>הוספת סוג מטוס חדש</h3>
            <div className="addingForm">
              <input
                placeholder="שם הדגם:"
                value={newTypeData.typeName}
                onChange={(event) => setNewTypeData({ ...newTypeData, typeName: event.target.value })}
              />
              <input
                placeholder="מהירות מקסימלית (קמ''ש):"
                type="number"
                value={newTypeData.maxSpeed}
                onChange={(event) => setNewTypeData({ ...newTypeData, maxSpeed: event.target.value })}
              />
              <input
                placeholder="קיבולת דלק (ליטרים):"
                type="number"
                value={newTypeData.fuelCapacity}
                onChange={(event) => setNewTypeData({ ...newTypeData, fuelCapacity: event.target.value })}
              />
            </div>
            <div className="modalActions">
              <button className="confirmButton" onClick={handleSaveType}>שמור במערכת</button>
              <button className="cancelButton" onClick={() => setIsAddModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AircraftsTypes;