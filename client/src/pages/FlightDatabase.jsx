import NavBar from "../components/NavBar.jsx"
import Table from "../components/Table.jsx"
import { flightsData } from "../utills/flightsFunctions.js";

function FlightDatabase() {
  return (
    <>
      <NavBar />
      <h1 className="title flightDatabasetitle">
        מאגר טיסות
      </h1>

      <Table columns={["מספר זיהוי של הטיסה", "מספר זיהוי של המטוס", "שעת יציאה", "שעת חזרה לבסיס", "נקודת אורך של היעד", "נקודת רוחב של היעד"]} rows={flightsData} />
    </>
  )
}

export default FlightDatabase