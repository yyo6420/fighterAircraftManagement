import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addAircraft, deleteAircraft, getAircraftById, getAircraftByName, getAllAircrafts } from "../services/aircrafts.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { aircraftName, aircraftType } = request.body;
    if (!aircraftName || !aircraftType) throw new Error("you must type an aircraftName and aircraftType");

    const aircraft = await addAircraft(aircraftName, aircraftType);

    response.status(201).send({ message: "The aircraft added successfully", aircraft })
}));

router.get("/", asyncHandler(async (request, response) => {
    const aircrafts = await getAllAircrafts();
    response.send(aircrafts);
}));

router.get("/id/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const aircraft = await getAircraftById(id);
    response.send(aircraft);
}));

router.get("/name/:name", asyncHandler(async (request, response) => {
    const name = request.params.name;

    const aircraft = await getAircraftByName(name);
    response.send(aircraft)
}));

router.delete("/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const result = await deleteAircraft(id);

    response.send({ message: "The aircraft removed succeessfully", result })
}))

export default router;