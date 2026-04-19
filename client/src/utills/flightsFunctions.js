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