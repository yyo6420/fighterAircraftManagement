import { Link } from "react-router";
import { MapPin } from "lucide-react";

function HomePage() {
    return (
        <>
            <nav className="navBar">
                <div className="navBarTitleDiv">
                    <h2 className="navBarTitle">מערכת לניהול מטוסים</h2>
                    <img className="navBarIcon" src="../../public/aircraftIcon.png" alt="תמונה של מטוס קרב" />
                </div>
            </nav>

            <h1 className="title welcome">ברוכים הבאים </h1>

            <div className="menu">
                <Link to={"/aircraftsPool"} className="menuButton aircraftsPool">מאגר מטוסים</Link>
                <Link to={"/aircraftsTypes"} className="menuButton aircraftsTypes">סוגי מטוסים</Link>
                <Link to={"/flightDatabase"} className="menuButton flightDatabase">מאגר טיסות</Link>
                <Link to={"/map"} className="menuButton mapButton">מפה <MapPin size={24} /> </Link>
            </div>
        </>
    )
}

export default HomePage;