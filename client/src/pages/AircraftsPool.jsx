import NavBar from "../components/NavBar.jsx"
import Table from "../components/Table.jsx"
import { aircraftsData } from "../utills/aircraftsFunctions.js";

function AircraftsPool() {
  return (
    <>
      <NavBar />
      <h1 className="title aircraftsPoolTitle">
        מאגר מטוסים
      </h1>

      <Table columns={["מספר זיהוי", "שם המטוס", "סוג מטוס"]}  rows={aircraftsData}/>
    </>
  )
}

export default AircraftsPool