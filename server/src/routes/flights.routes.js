import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addFlight } from "../services/flights.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { id, takeoffTime, latitude, landingTime, longitude } = request.body;
    if (!id || !takeoffTime || !latitude || !longitude) {
        throw new Error("you must type an id, takeoffTime, latitude and longitude");
    };

    const newFlight = await addFlight(id, takeoffTime, landingTime || null, latitude, longitude);

    response.status(201).send({ message: "The flight details have been successfully updated", newFlight });
}));

export default router;