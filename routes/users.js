import express from "express";
import { getProfile } from "../controllers/userController.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);

export default router;
