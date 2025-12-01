import Outbreak from '../models/Outbreak.js';

// ⬇ FIXED detectOutbreak – works with your mock data
export const detectOutbreak = async (district, disease) => {
    const today = new Date();

    const twelveWeeksAgo = new Date(today);
    twelveWeeksAgo.setDate(today.getDate() - 84);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const allData = await Outbreak.find({
        district,
        disease,
        reportDate: { $gte: twelveWeeksAgo }
    }).sort({ reportDate: 1 });

    if (allData.length < 4) {
        return { enoughData: false };
    }

    // Split into historical vs current week
    const historical = allData.filter(d => d.reportDate < oneWeekAgo);
    const currentWeek = allData.filter(d => d.reportDate >= oneWeekAgo);

    if (historical.length < 3 || currentWeek.length < 1) {
        return { enoughData: false };
    }

    const historicalAvg =
        historical.reduce((s, r) => s + r.casesCount, 0) / historical.length;

    const currentWeekTotal = currentWeek.reduce(
        (s, r) => s + r.casesCount,
        0
    );

    const increasePercent =
        ((currentWeekTotal - historicalAvg) / historicalAvg) * 100;

    let alertLevel = "LOW";
    let isOutbreak = false;

    if (increasePercent >= 20) alertLevel = "MEDIUM";
    if (increasePercent >= 50) alertLevel = "HIGH";
    if (increasePercent >= 100) alertLevel = "CRITICAL";

    if (increasePercent >= 20) isOutbreak = true;

    return {
        enoughData: true,
        isOutbreak,
        alertLevel,
        historicalAvg: Math.round(historicalAvg),
        currentWeekCount: currentWeekTotal,
        increasePercent: Math.round(increasePercent),
        dateRange: {
            historicalFrom: twelveWeeksAgo,
            currentFrom: oneWeekAgo,
        }
    };
};
