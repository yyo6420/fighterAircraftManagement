import { flightCollection, db } from "../mongodb/mongodb.js"

export const addFlight = async (aircraftId, takeoffTime, landingTime, latitude, longitude) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    }

    const result = await flightCollection.insertOne({
        aircraftId,
        takeoffTime,
        landingTime,
        latitude,
        longitude
    });

    return { id: result.insertedId, result };
};