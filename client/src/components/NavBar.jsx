import { NavLink } from "react-router"

function NavBar() {
    return (
        <nav className="navBar">
            <NavLink to={"/"} className="navBarButton goHome">חזרה לדף הבית</NavLink>
            
            <div className="navBarButtonsDiv">
                <NavLink to={"/aircraftsPool"} className="navBarButton aircraftsPool">מאגר מטוסים</NavLink>
                <NavLink to={"/aircraftsTypes"} className="navBarButton aircraftsTypes">סוגי מטוסים</NavLink>
                <NavLink to={"/flightDatabase"} className="navBarButton flightDatabase">מאגר טיסות</NavLink>
            </div>
        </nav>
    )
}

export default NavBar