import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addFlight, deleteFlight, getAllFligts, getFlightById, getFlightsByAircraftId, updatedLandingTimeById } from "../services/flights.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { aircraftId, takeoffTime, latitude, landingTime, longitude } = request.body;
    if (!aircraftId || !takeoffTime || !latitude || !longitude) {
        throw new Error("you must type an id, takeoffTime, latitude and longitude");
    };

    const newFlight = await addFlight(aircraftId, takeoffTime, landingTime || null, latitude, longitude);

    response.status(201).send({ message: "The flight details have been successfully updated", newFlight });
}));

router.get("/", asyncHandler(async (request, response) => {
    const flights = await getAllFligts();
    response.send(flights);
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
}));

router.delete("/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const result = await deleteFlight(id);

    response.send({ message: "The flight removed successfully", result });
}));

router.put("/land/:id", asyncHandler(async (request, response) => {
    const { landingTime } = request.body;
    const id = request.params.id;

    const result = await updatedLandingTimeById(id, landingTime);

    response.send({ message: "Landing time updated succssfully", result });
}));

export default router;