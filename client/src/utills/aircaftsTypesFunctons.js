const getAllTypes = async () => {
    try {
        const fetchData = await fetch("http://localhost:5010/api/aircraftstypes", {
            method: "GET"
        });
        if (!fetchData) throw new Error("Fetch failed :(");

        const types = await fetchData.json();

        return types;
    } catch (error) {
        console.error(error.message);
    };
}

export const typesData = await getAllTypes();