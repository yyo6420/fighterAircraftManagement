import { useState, useEffect, Fragment } from "react";
import NavBar from "../components/NavBar.jsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from "react-leaflet";
import { getAllflights, getFlightsByRadius, getInterpolatedPosition } from "../utills/flightsFunctions.js";
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
    const [nearbyFlights, setNearbyFlights] = useState([]);
    const [isNearbyResultsOpen, setIsNearbyResultsOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const isFlightActive = (takeoff, landing) => {
        const now = new Date();
        const takeoffDate = new Date(takeoff);
        const landingDate = new Date(landing);

        return now >= takeoffDate && now <= landingDate;
    };

    const handleFetchNearby = async (targetPos, radius) => {
        try {
            const [latitude, longitude] = targetPos;
            const data = await getFlightsByRadius(latitude, longitude, radius);
            setNearbyFlights(data || []);
            setIsNearbyResultsOpen(true);
        } catch (error) {
            alert("שגיאה בשליפת מטוסים קרובים");
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(event) {
                if (event.latlng) {
                    setPosition(event.latlng);
                    setSelectedFlightId(null);
                    map.panTo(event.latlng, map.getZoom());
                }
            },
        });

        if (!position) return null;

        return (
            <Marker position={position} icon={homeBaseIcon} draggable eventHandlers={{
                dragend: (event) => {
                    const marker = event.target;
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    setSelectedFlightId(null);
                }
            }}>
                <Popup>
                    <div
                        className="popupDiv"
                        onMouseDown={(event) => L.DomEvent.stopPropagation(event)}
                        onClick={(event) => L.DomEvent.stopPropagation(event)}
                    >
                        <b>נ"צ שנבחר ידנית</b><br />
                        <hr />
                        <b>נ"צ:</b> {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                        <hr />
                        <div className="popupButtons">
                            <button className="popupButton popupSearchFlightsButton"
                                onClick={(event) => {
                                    L.DomEvent.stopPropagation(event);
                                    setSelectedFlightId("manual");
                                    setIsAddModalOpen(true);
                                }}>
                                חיפוש מטוסים קרובים
                            </button>

                            {selectedFlightId === "manual" && (
                                <>
                                    <button className="popupButton popupCancelButton"
                                        onClick={(event) => {
                                            L.DomEvent.stopPropagation(event);
                                            setSelectedFlightId(null);
                                            setRadiusDistance(1000);
                                        }}>
                                        ביטול רדיוס
                                    </button>

                                    <button
                                        className="popupButton popupDisplayAircraftsButton"
                                        onClick={(event) => {
                                            L.DomEvent.stopPropagation(event);
                                            handleFetchNearby([position.lat, position.lng], radiusDistance);
                                        }}
                                    >
                                        הצגת מטוסים קרובים
                                    </button>
                                </>
                            )}

                            <button
                                className="popupButton popupcancelButtton"
                                onClick={(event) => {
                                    L.DomEvent.stopPropagation(event);
                                    setPosition(null);
                                    setSelectedFlightId(null);
                                }}
                            >
                                הסר סמן
                            </button>
                        </div>
                    </div>
                </Popup>
            </Marker>
        );
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
                    <div className="noFlightsAlert">
                        אין פעילות מבצעית בשעה זו
                    </div>
                )}

                <MapContainer center={baseStation} zoom={5} className="actualLeafletMap">
                    <TileLayer
                        attribution='&copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                    <LocationMarker />

                    {selectedFlightId === "manual" && position && (
                        <Circle
                            center={position}
                            radius={radiusDistance}
                            pathOptions={{
                                color: '#00FF00',
                                fillColor: '#00FF00',
                                fillOpacity: 0.1,
                                dashArray: '2, 6',
                                weight: 2,
                            }}
                        />
                    )}

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
                        <div className="addingForm">
                            <label className="inputLabel">
                                הגדרת רדיוס חיפוש:
                            </label>
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
                                setSelectedFlightId(null);
                            }}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}

            {isNearbyResultsOpen && (
                <div className="modalOverlay">
                    <div className="modalContent resultsModal">
                        <h3>מטוסים שאותרו ברדיוס</h3>
                        <hr />
                        <div className="nearbyFlightsList">
                            {nearbyFlights.length > 0 ? (
                                nearbyFlights.map(f => (
                                    <div key={f._id} className="nearbyFlightItem">
                                        <p><b>מזהה מטוס:</b> {f.aircraftId.slice(-6)}</p>
                                        <p><b>נ"צ נוכחי:</b> {f.latitude}, {f.longitude}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="noResultsContainer">
                                    <p className="noResultsWorring">
                                        ⚠️ לא אותרו כלי טיס בטווח המבצעי המוגדר.
                                    </p>
                                    <p className="noResultsText">
                                        נסה להגדיל את רדיוס החיפוש או המתן להתקדמות המשימה.
                                    </p>
                                </div>
                            )}

                        </div>
                        <div className="modalActions">
                            <button className="confirmBtn popupcloseButton" onClick={() => setIsNearbyResultsOpen(false)}>
                                סגור
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Map;