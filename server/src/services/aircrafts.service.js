import { ObjectId } from "mongodb";
import { aircraftsCollection, db } from "../mongodb/mongodb.js"

export const addAircraft = async (aircraftName, aircraftType) => {
    if (!aircraftsCollection) {
        aircraftsCollection = db?.collection("aircrafts")
    }

    const result = await aircraftsCollection.insertOne({
        aircraftName,
        aircraftType
    });
    return { id: result.insertedId, aircraftName }
}

export const getAircraftById = async (aircraftId) => {
    if (!ObjectId.isValid(aircraftId)) {
        throw new Error("Invalid ID format");
    }

    if (!aircraftsCollection) {
        aircraftsCollection = db?.collection("aircrafts");
    }

    const result = await aircraftsCollection.findOne({ _id: new ObjectId(aircraftId) });

    if (!result) throw new Error("Aircraft not found");

    return result;
}

export const getAllAircrafts = async (filter = {}) => {
    if (!aircraftsCollection) {
        aircraftsCollection = db?.collection("aircrafts")
    }

    const result = aircraftsCollection.find(filter).toArray();
    if (!result) throw new Error("The resulst are not found :(");

    return result;
} 