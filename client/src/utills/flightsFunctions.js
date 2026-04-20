const getAllflights = async () => {
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

export const flightsData = await getAllflights();

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