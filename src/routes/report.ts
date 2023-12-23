import express from "express";

import { getReport } from "../controllers/report";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

//GET /report/:reportId
router.get("/:reportId?", isAuthenticated, getReport);

export default router;