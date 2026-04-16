import HomePage from './pages/HomePage.jsx';
import './styles/App.css';
import { Routes, Route } from "react-router";

function App() {

  return (
    <>
      <nav className="navBar">
        <h2 className="navBarTitle">מערכת לניהול מטוסים</h2>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
