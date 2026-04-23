export const getAllTypes = async () => {
    try {
        const response = await fetch("http://localhost:5010/api/aircraftstypes", {
            method: "GET"
        });
        if (!response.ok) throw new Error("Fetch failed :(");

        const types = await response.json();

        return types;
    } catch (error) {
        console.error(error.message);
    };
}

export const typesData = await getAllTypes();

export const addNewType = async (typeData) => {
    try {
        const response = await fetch("http://localhost:5010/api/aircraftstypes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(typeData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to add type");
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export const deleteTypeFromApi = async (typeId) => {
    try {
        const response = await fetch(`http://localhost:5010/api/aircraftstypes/${typeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add type :(");
        }

        return data;
    } catch (error) {
        console.error("Error in deleteTypeFromApi:", error);
        throw error;
    }
};