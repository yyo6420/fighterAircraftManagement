import NavBar from "../components/NavBar.jsx"
import Table from "../components/Table.jsx"
import { typesData } from "../utills/aircaftsTypesFunctons.js";

function AircraftsTypes() {
  return (
    <>
      <NavBar />
      <h1 className="title aircraftsTypesTitle">
        סוגי מטוסים
      </h1>

      <Table columns={["מספר זיהוי", "שם הדגם", "מהירות מקסימלית", "קיבולת דלק"]} rows={typesData} />
    </>
  )
}

export default AircraftsTypes