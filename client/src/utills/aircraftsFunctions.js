const getAllAircrafts = async () => {
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

export const aircraftsData = await getAllAircrafts();