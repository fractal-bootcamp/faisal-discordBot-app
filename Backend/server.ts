import { Client, GatewayIntentBits, TextChannel } from "discord.js"
import express, { Request, Response } from "express"
import axios from "axios"
import dotenv from "dotenv"
const cors = require("cors")

dotenv.config()

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

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
client.login(BOT_TOKEN)
    .then(() => {
        console.log("Discord bot logged in successfully.");

    }).catch((err) => {
        console.error("Failed to login to Discord", err);

    })

// Send a subway status update to Discord subway-commute-alerts channel in Subway-Commute-Server
const sendDiscordMessage = async (channelID: string, message: string) => {
    const channel = client.channels.cache.get(channelID)
    if (channel && channel instanceof TextChannel) {
        try {
            await channel.send(message)
            console.log(`Message sent: ${message}`);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    } else {
        console.error("Channel not found or is not a text-based channel.");

    }
}

// Example of sending a message
client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);

    //Log available channels to verify correct channel ID
    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
            console.log(`Channel found: ${channel.name}, ID: ${channel.id}, Type: ${channel.type}`);
        })
    })

    const testChannelId = "1289644840606367767"
    const channel = client.channels.cache.get(testChannelId)

    if (channel && channel instanceof TextChannel) {
        sendDiscordMessage(testChannelId, "Test message from Subway Commute Bot!")
    } else {
        console.error("Channel not found or is not a text-based channel.");

    }
})


// Check server is alive
app.get("/", (req: Request, res: Response) => {
    res.send("I am alive")
})

// API endpoints for subway alerts
const MTA_SERVICE_ALERTS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"

// Fetch subway alerts
app.get("/subway-alerts", async (req: Request, res: Response) => {
    try {
        const response = await axios.get(MTA_SERVICE_ALERTS_URL)
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subway alerts." })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
})
