import { aircraftsTypesCollection, db } from "../mongodb/mongodb.js"

export const addType = async (typeName, maxSpeedKph, fuelCapacityLiters) => {
    if (!aircraftsTypesCollection) {
        aircraftsTypesCollection = db?.collection("aircraftsTypes")
    }

    const result = await aircraftsTypesCollection.insertOne({
        typeName,
        maxSpeedKph,
        fuelCapacityLiters
    })

    return { id: result.insertedId, typeName }
};

export const getTypeByName = async (typeName) => {
    if (!aircraftsTypesCollection) {
        aircraftsTypesCollection = db?.collection("aircraftsTypes")
    };

    const result = await aircraftsTypesCollection.findOne({ typeName: typeName });
    if (!result) throw new Error("Type not found :(");

    return result;
};