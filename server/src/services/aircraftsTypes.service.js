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
}