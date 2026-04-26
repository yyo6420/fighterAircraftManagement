import NavBar from "../components/NavBar.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
    iconAnchor: [15, 15]
});


function Map() {
    const baseStation = [31.839, 34.818];

    const attackTargets = [
        { id: 1, name: "נמל ביירות", coords: [33.901, 35.518], info: "יעד לוגיסטי אסטרטגי" },
        { id: 2, name: "שדה תעופה דמשק", coords: [33.411, 36.514], info: "צומת העברות נשק" },
        { id: 3, name: "נמל לטקיה", coords: [35.531, 35.787], info: "בסיס אספקה ימי" },
        { id: 4, name: "מתקן נתנז", coords: [33.722, 51.727], info: "יעד תשתית קריטי (מעגל 3)" },
        { id: 5, name: "נמל באנדר עבאס", coords: [27.150, 56.200], info: "שליטה על המפרץ" },
        { id: 6, name: "כור אראק", coords: [34.372, 49.241], info: "מתקן מים כבדים" },
        { id: 7, name: "נמל חודיידה", coords: [14.836, 42.940], info: "בסיס לוגיסטי דרומי" }
    ];

    return (
        <>
            <NavBar />
            <h1 className="title mapTitle">מפה</h1>

            <div className="tableStyleMapWrapper">
                <MapContainer
                    center={baseStation}
                    zoom={5}
                    className="actualLeafletMap"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                    <Marker position={baseStation} icon={homeBaseIcon}>
                        <Popup>
                            <b>בסיס אם - תל נוף</b> <br />
                            מרכז פיקוד ושליטה.
                        </Popup>
                    </Marker>

                    {attackTargets.map((target) => (
                        <Marker
                            key={target.id}
                            position={target.coords}
                            icon={tacticalTargetIcon}
                        >
                            <Popup>
                                <div className="popupDiv">
                                    <b>מטרה: {target.name}</b> <br />
                                    <i>נ"צ: {target.coords[0].toFixed(3)}, {target.coords[1].toFixed(3)}</i> <br />
                                    {target.info}
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