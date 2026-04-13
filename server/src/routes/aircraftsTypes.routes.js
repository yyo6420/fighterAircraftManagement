import express from "express";
import asyncHandler from "../utills/asyncHandler.js";
import { addType } from "../services/aircraftsTypes.service.js";

const router = express.Router();

router.post("/", asyncHandler(async (request, response) => {
    const { name, maxSpeed, fuel } = request.body;
    if (!name || !maxSpeed || !fuel) throw new Error("you must type a name and maxSpeed and fuel");

    const newType = await addType(name, maxSpeed, fuel);

    response.status(201).send({ message: "The new Type added successfully", newType });
}))

export default router;