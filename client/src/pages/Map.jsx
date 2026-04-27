import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getAllflights } from "../utills/flightsFunctions.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const homeBaseIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const tacticalTargetIcon = L.divIcon({
    className: 'tacticalTargetIcon',
    html: '<div class="tacticalCrosshair"><div class="crosshairLines"></div></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});


function Map() {
    const baseStation = [31.839, 34.818];
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const isFlightActive = (takeoff, landing) => {
        const now = new Date();
        const takeoffDate = new Date(takeoff);
        const landingDate = new Date(landing);

        return now >= takeoffDate && now <= landingDate;
    };

    useEffect(() => {
        const fetchFlights = async () => {
            const data = await getAllflights();
            if (data) {
                setFlights(data);
            }
            setLoading(false);
        };
        fetchFlights();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    if (loading) return <div className="loadinText">טוען נתונים...</div>;

    return (
        <>
            <NavBar />
            <h1 className="title mapTitle">מפה</h1>

            <div className="tableStyleMapWrapper">

                {flights.filter(f => isFlightActive(f.takeoffTime, f.landingTime)).length === 0 && (
                    <div className="no-flights-alert">
                        אין פעילות מבצעית בשעה זו
                    </div>
                )}

                <MapContainer center={baseStation} zoom={5} className="actualLeafletMap">
                    <TileLayer
                        attribution='&copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                    <Marker position={baseStation} icon={homeBaseIcon}>
                        <Popup><b>בסיס תל נוף</b></Popup>
                    </Marker>

                    {flights
                        .filter(flight => isFlightActive(flight.takeoffTime, flight.landingTime))
                        .map((flight) => (
                            <Marker
                                key={flight._id}
                                position={[parseFloat(flight.latitude), parseFloat(flight.longitude)]}
                                icon={tacticalTargetIcon}
                            >
                                <Popup>
                                    <div className="popupDiv">
                                        <b>סטטוס: בביצוע ⚡</b><br />
                                        <b>מזהה כלי טיס:</b> {flight.aircraftId.slice(-6)} <br />
                                        <b>זמן המראה:</b> {new Date(flight.takeoffTime).toLocaleTimeString('he-IL')} <br />
                                        <b>נחיתה משוערת:</b> {new Date(flight.landingTime).toLocaleTimeString('he-IL')} <br />
                                        <hr />
                                        <i>נ"צ: {flight.latitude}, {flight.longitude}</i>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>
        </>
    );
}

export default Map;