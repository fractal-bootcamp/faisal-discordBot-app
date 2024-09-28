// Define the user preferences type
interface UserPreferences {
    lines: string[]
    morningTime: string
    eveningTime: string
}

// Object to store user preferences by userId
const userPreferences: { [userId: string]: UserPreferences } = {}


// Set user preferences
export const setUserPreferences = (userId: string, lines: string[], morningTime: string, eveningTime: string) => {
    userPreferences[userId] = { lines, morningTime, eveningTime }
    console.log(`Preferences updated for user: ${userId}`, userPreferences[userId])
}

// Get user preferences by userId
export const getUserPreferences = (userId: string) => {
    return userPreferences[userId] || { lines: [], morningTime: "07:00", eveningTime: "17:00" }
}

export const getAllUserPreferences = (): { [userId: string]: UserPreferences } => {
    return userPreferences;
}