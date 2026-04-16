function HomePage() {
    return (
        <>
            <h1 className="welcomeTitle">ברוכים הבאים </h1>

            <div className="menu">
                <button className="menuButton aircraftsPool">מאגר מטוסים</button>
                <button className="menuButton aircraftsTypes">סוגי מטוסים</button>
                <button className="menuButton flightDatabase">מאגר טיסות</button>
            </div>
        </>
    )
}

export default HomePage;