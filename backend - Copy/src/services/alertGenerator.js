export const generateAlertMessage = (outbreakInfo, language = "en") => {
    const { district, disease, alertLevel, currentCases, averageCases } = outbreakInfo;

    const messages = {
        hi: {
            CRITICAL: `🚨 *अत्यंत गंभीर अलर्ट* 🚨
📍 स्थान: ${district}
🦠 बीमारी: ${disease}
📊 मामले: ${currentCases} (सामान्य: ${averageCases})
⚠️ आपके क्षेत्र में गंभीर प्रकोप पाया गया!
📞 आपातकाल: 108`,

            HIGH: `🚨 *गंभीर अलर्ट* 🚨
📍 ${district}
🦠 ${disease}
📊 मामले: ${currentCases}
⚠️ सावधानी बरतें!`,

            MEDIUM: `⚠️ *सावधानी अलर्ट*
📍 ${district}
🦠 ${disease}
📊 मामले बढ़ रहे हैं।`,

            LOW: `ℹ️ *जानकारी*
${district} में स्थिति सामान्य है।
📊 मामले: ${currentCases}`
        },

        en: {
            CRITICAL: `🚨 *CRITICAL ALERT* 🚨
📍 Location: ${district}
🦠 Disease: ${disease}
📊 Cases: ${currentCases} (Normal: ${averageCases})
⚠️ Severe outbreak detected!
📞 Emergency: 108`,

            HIGH: `🚨 *HIGH ALERT*
📍 ${district}
🦠 ${disease}
📊 Rising cases: ${currentCases}, stay alert!`,

            MEDIUM: `⚠️ *CAUTION ALERT*
📍 ${district}
🦠 ${disease}
📊 Cases increasing: ${currentCases}.`,

            LOW: `ℹ️ *INFO*
${district} situation is under control (${currentCases} cases).`
        }
    };

    if (!messages[language]) return "Alert message unavailable";
    if (!messages[language][alertLevel]) return "Alert message unavailable";

    return messages[language][alertLevel];
};
