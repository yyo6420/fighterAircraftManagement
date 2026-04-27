export const getAllflights = async () => {
    try {
        const fetchData = await fetch("http://localhost:5010/api/flights", {
            method: "GET"
        })
        if (!fetchData.ok) throw new Error("Fetch failed :(");

        const flights = await fetchData.json();

        return flights;
    } catch (error) {
        console.error(error.message);
    };
}

export const getFlightsByAircraftId = async (aircraftId) => {
    try {
        const response = await fetch(`http://localhost:5010/api/flights/aircraft/${aircraftId}`, {
            method: "GET"
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "No flights were found for this aircraft");
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const getFlightById = async (flightId) => {
    try {
        const response = await fetch(`http://localhost:5010/api/flights/id/${flightId}`, {
            method: "GET"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Flight not found");
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error.message);
        throw error;
    }
}

export const updateLandingTime = async (flightId, landingTime) => {
    try {
        const response = await fetch(`http://localhost:5010/api/flights/land/${flightId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ landingTime }),
        });

        if (!response.ok) throw new Error("Failed to update landing time");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
        throw error
    }
}

export const addNewFlight = async (flightData) => {
    try {
        const response = await fetch(`http://localhost:5010/api/flights`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flightData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to add flight");
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const deleteFlight = async (flightId) => {
    try {
        const response = await fetch(`http://localhost:5010/api/flights/${flightId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to delete the flight from the database");
        }

        return await response.json();
    } catch (error) {
        console.error("Delete Error:", error.message);
        throw error;
    }
};

export const getInterpolatedPosition = (base, target, takeoff, landing, currentTime) => {
    const now = currentTime ? new Date(currentTime) : new Date();
    const start = new Date(takeoff);
    const end = new Date(landing);

    const totalDuration = end - start;

    if (totalDuration <= 0) return target;

    const progress = Math.max(0, Math.min(1, (now - start) / totalDuration));

    const lat = base[0] + (target[0] - base[0]) * progress;
    const lng = base[1] + (target[1] - base[1]) * progress;

    return [lat, lng];
};