import express from 'express';
import {
    getAllOutbreaks,
    checkOutbreak,
    runDailyCheck,
    getStats
} from '../controllers/outbreakController.js';

import * as outbreakController from "../controllers/outbreakDataController.js";

const router = express.Router();

router.get('/', getAllOutbreaks);
router.get('/check', checkOutbreak);
router.post('/daily-check', runDailyCheck);
router.get('/stats', getStats);




// Generate mock data (for demo)
router.get("/generate-mock-data", outbreakController.generateMockData);

// Get all outbreaks (with pagination)
router.get("/all", outbreakController.getAllOutbreaks);

// Get current week outbreaks (active alerts)
router.get("/current", outbreakController.getCurrentOutbreaks);

// Get statistics for dashboard
router.get("/stats", outbreakController.getStats);

// Get outbreaks by district
router.get("/district/:district", outbreakController.getOutbreaksByDistrict);

// Get outbreaks by disease
router.get("/disease/:disease", outbreakController.getOutbreaksByDisease);

// Get single outbreak by ID
router.get("/:id", outbreakController.getOutbreakById);

// Delete all outbreaks (testing only)
router.delete("/delete-all", outbreakController.deleteAllOutbreaks);



export default router;
