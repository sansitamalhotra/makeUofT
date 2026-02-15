<<<<<<< HEAD
import express from "express";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();
const port = 3000;

// 1) change this to your Arduino port (see notes below)
const arduinoPort = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let lastState = "UNKNOWN";

parser.on("data", (line) => {
  const msg = line.trim();
  if (msg !== lastState) {
    lastState = msg;
    console.log("Arduino:", msg);
  }
});

app.get("/state", (req, res) => {
  res.json({ state: lastState });
});

app.use(express.static("public")); // serve your website files

app.listen(port, () => console.log(`http://localhost:${port}`));
=======
// server.js
import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import { google } from "googleapis";
import cors from "cors";

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/* ---------------- Google Calendar ---------------- */
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client
});

/* ---------------- Routes ---------------- */

// Health check
app.get("/", (_, res) => {
    res.send("✅ Backend running");
});

// Calendar insert (USED NOW)
app.post("/calendar", async (req, res) => {
    try {
        const { summary, description, startDateTime, endDateTime } = req.body;

        const event = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary,
                description,
                start: {
                    dateTime: startDateTime,
                    timeZone: "America/Toronto"
                },
                end: {
                    dateTime: endDateTime,
                    timeZone: "America/Toronto"
                }
            }
        });

        console.log("📅 Calendar event created:", event.data.htmlLink);
        res.json({ success: true, event: event.data });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Calendar insert failed",
            details: err.message
        });
    }
});

/* ---------------- Start ---------------- */
app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
>>>>>>> 963706dc62ef5c238591164772b6d28fa15bef33
