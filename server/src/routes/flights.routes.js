import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addFlight, getFlightById, getFlightsByAircraftId } from "../services/flights.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { id, takeoffTime, latitude, landingTime, longitude } = request.body;
    if (!id || !takeoffTime || !latitude || !longitude) {
        throw new Error("you must type an id, takeoffTime, latitude and longitude");
    };

    const newFlight = await addFlight(id, takeoffTime, landingTime || null, latitude, longitude);

    response.status(201).send({ message: "The flight details have been successfully updated", newFlight });
}));

router.get("/id/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const flight = await getFlightById(id);
    response.send(flight);
}));

router.get("/aircraft/:id", asyncHandler(async (request, response) => {
    const aircraftId = request.params.id;

    const flights = await getFlightsByAircraftId(aircraftId);
    response.send(flights);
}))

export default router;