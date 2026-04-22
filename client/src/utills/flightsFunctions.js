export const getAllflights = async () => {
    try {
        const fetchData = await fetch("http://localhost:5010/api/flights", {
            method: "GET"
        })
        if (!fetchData) throw new Error("Fetch failed :(");

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