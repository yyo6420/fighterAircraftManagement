import { Link } from "react-router";

function HomePage() {
    return (
        <>
            <nav className="navBar">
                <div className="navBarTitleDiv">
                    <h2 className="navBarTitle">מערכת לניהול מטוסים </h2>
                    <img className="navBarIcon" src="../../public/aircraftIcon.png" alt="תמונה של מטוס קרב" />
                </div>
            </nav>

            <h1 className="welcomeTitle">ברוכים הבאים </h1>

            <div className="menu">
                <Link to={"/aircraftsPool"} className="menuButton aircraftsPool">מאגר מטוסים</Link>
                <Link to={"/aircraftsTypes"} className="menuButton aircraftsTypes">סוגי מטוסים</Link>
                <Link to={"/flightDatabase"} className="menuButton flightDatabase">מאגר טיסות</Link>
            </div>
        </>
    )
}

export default HomePage;