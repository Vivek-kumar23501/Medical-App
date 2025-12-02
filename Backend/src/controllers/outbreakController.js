import Outbreak from '../models/Outbreak.js';
import User from '../models/User.js';

import { detectOutbreak } from '../services/outbreakDetection.js';
import { generateAlertMessage } from '../services/alertGenerator.js';
import { sendBulkAlerts } from '../services/whatsappService.js';


// Get all active outbreaks
export const getAllOutbreaks = async (req, res) => {
    try {
        const outbreaks = await Outbreak.find({ isActive: true })
            .sort({ reportDate: -1 })
            .limit(100);

        res.json({
            status: 'success',
            count: outbreaks.length,
            data: outbreaks
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Check outbreak for specific location
export const checkOutbreak = async (req, res) => {
    try {
        const { district, disease } = req.query;

        if (!district || !disease) {
            return res.status(400).json({
                status: "error",
                message: "District and disease are required",
            });
        }

        const allData = await Outbreak.find({ district, disease }).sort({ reportDate: 1 });

        const result = await detectOutbreak(district, disease);

        if (!result) {
            return res.json({
                status: "success",
                message: "Insufficient data for analysis",
                debug: {
                    dbRecords: allData.length,
                    reason: "Not enough historical OR current week data",
                },
            });
        }

        // -------- FIXED: Use query params as fallback -----------
        const normalized = {
            district: result.district || district,  // ✅ Fallback to req.query
            disease: result.disease || disease,      // ✅ Fallback to req.query
            alertLevel: result.alertLevel,
            averageCases: result.averageCases,
            currentCases:
                result.currentCases ??
                result.currentWeekCount ??
                result.casesThisWeek ??
                "N/A"
        };

        const message = generateAlertMessage(normalized, "en");

        return res.json({
            status: "success",
            data: {
                ...normalized,
                isOutbreak: result.isOutbreak,
                alertMessage: message,
            },
        });
    } catch (error) {
        console.error("❌ ERROR in checkOutbreak:", error);
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};



// Daily outbreak detection and alerts
export const runDailyCheck = async (req, res) => {
    try {
        console.log(" Starting daily outbreak check...");

        const districts = await Outbreak.distinct('district');
        const diseases = ['Dengue', 'Malaria', 'COVID-19', 'Food Poisoning'];

        const detectedOutbreaks = [];

        for (const district of districts) {
            for (const disease of diseases) {

                const outbreak = await detectOutbreak(district, disease);

                if (!outbreak || !outbreak.isOutbreak) {
                    console.log(`❌ No outbreak → ${district} - ${disease}`);
                    continue;
                }

                const latestOutbreak = await Outbreak.findOne({
                    district,
                    disease
                }).sort({ reportDate: -1 });

                detectedOutbreaks.push({
                    district,
                    disease,
                    alertLevel: outbreak.alertLevel,
                    casesThisWeek: outbreak.currentWeekCount,
                    outbreakId: latestOutbreak._id
                });

                const users = await User.find({
                    district,
                    isActive: true,
                    'notificationPreference.whatsapp': true
                });

                if (users.length === 0) continue;

                // ⭐ FINAL FIX — SEND CORRECT FIELDS
                const message = generateAlertMessage(
                    {
                        district,
                        disease,
                        alertLevel: outbreak.alertLevel,
                        currentCases: outbreak.currentWeekCount,
                        averageCases: outbreak.previousWeekAvg
                    },
                    'hi'
                );

                await sendBulkAlerts(
                    users,
                    message,
                    latestOutbreak._id,
                    latestOutbreak.disease,
                    outbreak.alertLevel
                );
            }
        }

        return res.json({
            status: "success",
            message: "Daily check completed",
            outbreaksDetected: detectedOutbreaks.length,
            outbreaks: detectedOutbreaks
        });

    } catch (error) {
        console.error("❌ Daily Check ERROR:", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};




// Get outbreak statistics
export const getStats = async (req, res) => {
    try {
        const totalOutbreaks = await Outbreak.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ isActive: true });

        const byDisease = await Outbreak.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$disease',
                    count: { $sum: 1 },
                    totalCases: { $sum: '$casesCount' }
                }
            }
        ]);

        const byState = await Outbreak.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$state',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            status: 'success',
            data: {
                totalOutbreaks,
                totalUsers,
                byDisease,
                byState
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
