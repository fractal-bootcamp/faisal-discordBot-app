import cron from "node-cron"
import axios from "axios"
import { getAllUserPreferences, getUserPreferences } from "./userPreferences"
import { processSubwayAlerts, SubwayAlertsResponse } from "./subwayAlerts"
import { sendDiscordMessage } from "./discordBot"

// API endpoints for subway alerts
const MTA_SERVICE_ALERTS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"

// Set time preferences
export const setUpCronJobs = () => {
    // Schedule morning alerts
    cron.schedule("0 7 * * 1-5", async () => {
        console.log("Sending morning subway alerts...")
        const allUserPreferences = getAllUserPreferences()

        for (const userId in allUserPreferences) {
            const preferences = getUserPreferences(userId)
            try {
                const response = await axios.get<SubwayAlertsResponse>(MTA_SERVICE_ALERTS_URL)
                const messages = processSubwayAlerts(response.data, preferences.lines)
                await sendDiscordMessage(userId, messages)
            } catch (err) {
                console.error("Failed to send morning subway alerts:", err);
            }
        }
    })

    // Schedule evening alerts
    cron.schedule("0 17 * * 1-5", async () => {
        console.log("Sending evening subway alerts...")
        const allUserPreferences = getAllUserPreferences()

        for (const userId in allUserPreferences) {
            const preferences = getUserPreferences(userId)
            try {
                const response = await axios.get<SubwayAlertsResponse>(MTA_SERVICE_ALERTS_URL)
                const messages = processSubwayAlerts(response.data, preferences.lines)
                await sendDiscordMessage(userId, messages)
            } catch (err) {
                console.error("Failed to send evening subway alerts:", err);
            }
        }
    })
}