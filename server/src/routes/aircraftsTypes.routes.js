import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addType, deleteType, getAllTypes, getTypeById, getTypeByName } from "../services/aircraftsTypes.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { typeName, maxSpeed, fuelCapacity } = request.body;
    if (!typeName || !maxSpeed || !fuelCapacity) throw new Error("you must type a name and maxSpeed and fuel");

    const newType = await addType(typeName, maxSpeed, fuelCapacity);

    response.status(201).send({ message: "The new Type added successfully", newType });
}));

router.get("/", asyncHandler(async (request, response) => {
    const types = await getAllTypes();
    response.send(types);
}))

router.get("/name/:name", asyncHandler(async (request, response) => {
    const name = request.params.name;

    const type = await getTypeByName(name);
    response.send(type);
}));

router.get("/id/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const type = await getTypeById(id);
    response.send(type);
}));

router.delete("/:id", asyncHandler(async (request, response) => {
    const id = request.params.id;

    const result = await deleteType(id);

    response.send({ message: "The type removed successfully", result })
}))

export default router;