import { useState, useEffect, Fragment } from "react";
import NavBar from "../components/NavBar.jsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import { getAllflights, getInterpolatedPosition } from "../utills/flightsFunctions.js";
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

const aircraftIcon = L.divIcon({
    className: 'aircraftIcon',
    html: `
        <svg  width="30" height="30" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path d="M21,16L21,14L13,9L13,3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5L10,9L2,14L2,16L10,13.5L10,19L8,20.5L8,22L11.5,21L15,22L15,20.5L13,19L13,13.5L21,16Z" />
        </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

function Map() {
    const baseStation = [31.839, 34.818];
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [radiusDistance, setRadiusDistance] = useState(1000);


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
        }, 5000);

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
                        .map((flight) => {
                            const targetPosition = [parseFloat(flight.latitude), parseFloat(flight.longitude)];
                            const currentAircraftPos = getInterpolatedPosition(
                                baseStation,
                                targetPosition,
                                flight.takeoffTime,
                                flight.landingTime,
                                currentTime
                            );

                            return (
                                <Fragment key={flight._id}>
                                    {selectedFlightId === flight._id && (
                                        <Circle
                                            center={targetPosition}
                                            radius={radiusDistance}
                                            pathOptions={{
                                                color: '#00FF00',
                                                fillColor: '#00FF00',
                                                fillOpacity: 0.1,
                                                dashArray: '2, 6',
                                                weight: 2,
                                                lineCap: 'butt'
                                            }}
                                        />
                                    )}
                                    <Marker position={currentAircraftPos} icon={aircraftIcon}>
                                        <Popup>
                                            <div className="popupDiv">
                                                <b>מטוס בדרך ליעד</b><br />
                                                <b>מזהה:</b> {flight.aircraftId.slice(-6)}
                                            </div>
                                        </Popup>
                                    </Marker>

                                    <Marker position={targetPosition} icon={tacticalTargetIcon}>
                                        <Popup>
                                            <div className="popupDiv">
                                                <b>מטרה טקטית</b><br />
                                                <hr />
                                                <b>נ"צ:</b> {targetPosition[1].toFixed(4)}, {targetPosition[0].toFixed(4)}
                                                <hr />
                                                <div className="modalActions">
                                                    <button className="popupButton popupSearchFlightsButton"
                                                        onClick={() => {
                                                            setSelectedFlightId(flight._id);
                                                            setIsAddModalOpen(true);
                                                        }}>
                                                        חיפוש מטוסים קרובים
                                                    </button>

                                                    {selectedFlightId === flight._id && (
                                                        <button className="popupButton popupCancelButton"
                                                            onClick={() => {
                                                                setSelectedFlightId(null);
                                                                setRadiusDistance(1000);
                                                            }}>
                                                            ביטול רדיוס
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>

                                    <Polyline positions={[baseStation, targetPosition]} pathOptions={{ color: 'red', weight: 2, dashArray: '10, 10', opacity: 0.6 }} />
                                    <Polyline positions={[baseStation, currentAircraftPos]} pathOptions={{ color: 'green', weight: 3, opacity: 0.8 }} />
                                </Fragment>
                            );
                        })
                    }
                </MapContainer>
            </div>
            {isAddModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3>הגדרת טווח חיפוש</h3>
                        <div className="addFlightForm">
                            <label className="inputLabel">הגדרת רדיוס חיפוש:</label>
                            <input
                                className="searchInput"
                                type="number"
                                value={radiusDistance}
                                onChange={(event) => setRadiusDistance(Number(event.target.value))}
                                autoFocus
                            />
                        </div>
                        <div className="modalActions">
                            <button className="confirmBtn" onClick={() => setIsAddModalOpen(false)}>עדכן רדיוס</button>
                            <button className="cancelBtn" onClick={() => {
                                setIsAddModalOpen(false);
                            }}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Map;