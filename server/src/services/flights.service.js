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
};

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
};

export const getFlightsByAircraftId = async (aircraftId) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    }

    const result = await flightCollection.find({ aircraftId: aircraftId }).toArray();

    if (result.length === 0) {
        console.log(`No flights found for aircraft: ${aircraftId}`);
    }

    return result;
};

export const getAllFligts = async (filter = {}) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    const result = await flightCollection.find(filter).toArray();
    if (!result) throw new Error("The results are not found :(");

    return result;
};

export const deleteFlight = async (flightId) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    };

    if (!ObjectId.isValid(flightId)) {
        throw new Error("Invalid ID format");
    }

    const result = await flightCollection.deleteOne({ _id: new ObjectId(flightId) });
    if (result.deletedCount === 0) throw new Error("The results are not found :(");

    return result;
};

const calculateDistanceBetweenPoints = (targetLatitude, targetLongitude, flightLatitude, flightLongitude) => {
    const EARTH_RADIUS_METERS = 6371e3;
    const targetLatRadian = (targetLatitude * Math.PI) / 180;
    const flightLatRadian = (flightLatitude * Math.PI) / 180;
    const latitudeDifference = ((flightLatitude - targetLatitude) * Math.PI) / 180;
    const longitudeDifference = ((flightLongitude - targetLongitude) * Math.PI) / 180;

    const calculationStep = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
        Math.cos(targetLatRadian) * Math.cos(flightLatRadian) *
        Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);

    const centralAngle = 2 * Math.atan2(Math.sqrt(calculationStep), Math.sqrt(1 - calculationStep));
    return EARTH_RADIUS_METERS * centralAngle;
};

export const getFlightsWithinSearchRadius = async (targetLatitude, targetLongitude, maxDistance) => {
    if (!flightCollection) {
        flightCollection = db?.collection("flights");
    }

    const now = new Date().toISOString();

    const activeFlights = await flightCollection.find({
        takeoffTime: { $lte: now },
        landingTime: { $gte: now }
    }).toArray();

    const nearbyFlights = activeFlights.filter(flight => {
        const distanceToTarget = calculateDistanceBetweenPoints(
            parseFloat(targetLatitude),
            parseFloat(targetLongitude),
            parseFloat(flight.latitude),
            parseFloat(flight.longitude)
        );
        return distanceToTarget <= maxDistance;
    });

    return nearbyFlights;
};