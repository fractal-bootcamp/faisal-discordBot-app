interface AlertEntity {
    alert: {
        informed_entity: {
            route_id: string;
        }[]
        header_text: {
            translation: {
                text: string;
                language: string;
            }[]
        }
        description_text?: {
            translation: {
                text: string;
                language: string;
            }[]
        }
    }
}

export interface SubwayAlertsResponse {
    entity: AlertEntity[];
}

// Process subway alerts and filter them by user-specific lines
export const processSubwayAlerts = (alerts: SubwayAlertsResponse, userLines: string[]): string[] => {
    if (!alerts || !alerts.entity) {
        console.error("Invalid alerts data received.")
        return ["No alerts available."]
    }

    // Filter alerts for the user's selected subway lines
    const filteredAlerts = alerts.entity.filter((alertEntity) => {
        return alertEntity.alert.informed_entity.some((entity) => {
            return userLines.includes(entity.route_id);
        })
    })

    // If no relevant alerts are found
    if (filteredAlerts.length === 0) {
        return ["No service alerts for your selected lines."]
    }

    // Format the filtered alerts
    return filteredAlerts.map((alertEntity) => {
        const informedLines = alertEntity.alert.informed_entity
            .map((entity) => entity.route_id)
            .join(", ")

        const headerText = alertEntity.alert.header_text.translation.find(
            (t) => t.language === "en"
        )?.text || "No header text available"

        const descriptionText = alertEntity.alert.description_text?.translation.find(
            (t) => t.language === "en"
        )?.text || "No description available"

        return `🚨 **Alert for ${informedLines} Line(s)** 🚨\n**Message**: ${headerText}\n**Details**: ${descriptionText}`;
    })
}