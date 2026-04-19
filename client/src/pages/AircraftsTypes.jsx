import NavBar from "../components/NavBar.jsx"
import Table from "../components/Table.jsx"

function AircraftsTypes() {
  return (
    <>
      <NavBar />
      <h1 className="title aircraftsTypesTitle">
        סוגי מטוסים
      </h1>

      <Table columns={["מספר זיהוי", "שם הדגם", "מהירות מקסימלית", "קיבולת דלק"]} rows={[]} />
    </>
  )
}

export default AircraftsTypes