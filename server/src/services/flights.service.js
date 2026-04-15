import { ObjectId } from "mongodb";
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

export const updatedLandingTimeById = async (flightId, newLandingTime) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    if (!ObjectId.isValid(flightId)) {
        throw new Error("Invalid ID format");
    }

    const result = await flightCollection.updateOne(
        { _id: new ObjectId(flightId) },
        { $set: { landingTime: newLandingTime } }
    );

    if (!result) throw new Error("Flight not found");

    return result;
}

export const getFlightById = async (flightId) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    if (!ObjectId.isValid(flightId)) {
        throw new Error("Invalid ID format");
    }

    const result = await flightCollection.findOne({ _id: new ObjectId(flightId) });

    if (!result) throw new Error("Flight not found");

    return result;
}

export const getFlightsByAircraftId = async (aircraftId) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    const result = await flightCollection.find({ aircraftId: aircraftId }).toArray();
    if (!result) throw new Error("The results are not found :(");

    return result;
}

export const getAllFligts = async (filter = {}) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    const result = await flightCollection.find(filter).toArray();
    if (!result) throw new Error("The results are not found :(");

    return result;
}

export const deleteFLight = async (flightId) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    if (!ObjectId.isValid(flightId)) {
        throw new Error("Invalid ID format");
    }

    const result = await flightCollection.deleteOne({ _id: new ObjectId(flightId) });
    if (result.deletedCount === 0) throw new Error("The results are not found :(");

    return result;
}