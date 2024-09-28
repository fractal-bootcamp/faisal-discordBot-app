import express, { Request, Response } from "express"
import { startBot } from "./discordBot"
import { setUpCronJobs } from "./cronJobs"
const cors = require("cors")

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

// Start Discord bot
startBot()

// Setup scheduled notifications
setUpCronJobs()

// Check server is alive
app.get("/", (_req: Request, res: Response) => {
    res.send("I am alive")
})

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
})
