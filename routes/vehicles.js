import express from "express";
import { addVehicle, updateLocation, getVehicles } from "../controllers/vehicleController.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addVehicle);
router.put("/location", authMiddleware, updateLocation);
router.get("/", getVehicles);

export default router;
