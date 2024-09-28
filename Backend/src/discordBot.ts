import { Client, GatewayIntentBits, TextChannel } from "discord.js"
import { processSubwayAlerts } from "./subwayAlerts"
import { setUserPreferences, getUserPreferences } from "./userPreferences"
import dotenv from "dotenv"
dotenv.config()


// Initialize Discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

const BOT_TOKEN = process.env.BOT_TOKEN

// Login to Discord
export const startBot = () => {
    client.login(BOT_TOKEN)
        .then(() => {
            console.log("Discord bot logged in successfully.");
        }).catch((err) => {
            console.error("Failed to login to Discord", err);
        })

    client.once("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`)
    })

    // Listen to user commands
    client.on("messageCreate", (message) => {
        const [command, ...args] = message.content.toLocaleLowerCase().split(" ")

        if (command === "!setlines") {
            const lines = args
            setUserPreferences(message.author.id, lines, "07:00", "17:00")
            message.channel.send(`Preferences updated! Tracking lines: ${lines.join(", ")}`)
        }

        if (command === "!settime" && args.length === 2) {
            const [period, time] = args
            const preferences = getUserPreferences(message.author.id)

            if (period === "morning") {
                setUserPreferences(message.author.id, preferences.lines, time, preferences.eveningTime)
                message.channel.send(`Morning alert time set to: ${time} am`)
            } else if (period === "evening") {
                setUserPreferences(message.author.id, preferences.lines, preferences.morningTime, time)
                message.channel.send(`Evening alert time set to: ${time} pm`)
            }
        }
    })
}

// Send a subway status update to Discord subway-commute-alerts channel in Subway-Commute-Server
export const sendDiscordMessage = async (channelID: string, messages: string[]) => {
    const channel = client.channels.cache.get(channelID) as TextChannel
    if (channel) {
        try {
            for (const message of messages) {
                await channel.send(message)
            }
            console.log("Messages sent to Discord.");
        } catch (err) {
            console.error("Failed to send message to Discord:", err);
        }
    } else {
        console.error("Channel not found or is not a text-based channel.");
    }
}