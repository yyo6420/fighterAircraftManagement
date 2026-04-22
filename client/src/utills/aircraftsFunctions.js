export const getAllAircrafts = async () => {
    try {
        const fetchData = await fetch("http://localhost:5010/api/aircrafts", {
            method: "GET"
        })
        if (!fetchData) throw new Error("Fetch failed :(");

        const aircrafts = await fetchData.json();

        return aircrafts;
    } catch (error) {
        console.error(error.message);
    };
}

export const addNewAircraft = async (aircraftData) => {
    try {
        const response = await fetch("http://localhost:5010/api/aircrafts", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aircraftData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to add aircraft");
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export const getAircraftByName = async (aircraftName) => {
    try {
        const response = await fetch(`http://localhost:5010/api/aircrafts/name/${aircraftName}`, {
            method: "GET",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to find aircraft");
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}