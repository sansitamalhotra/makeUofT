// server.js
import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
//import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const app = express();
app.use(express.json());

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(__dirname));

// Multer for handling image uploads
//const upload = multer();
//const multer = require("multer");

// Google Calendar setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// -------- Routes --------

// Root route (optional)
app.get("/", (req, res) => {
    res.send("✅ Server is running! Go to /index.html for UI.");
});

// Test Calendar route
app.post("/analyze", async (req, res) => {
    try {
        const prompt = req.body.prompt || "Hello";
        console.log("Received prompt:", prompt);

        const GEMINI_MODEL = "models/gemini-2.5-pro";

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            }
        );

        const text = await response.text(); // <-- parse as text first
        console.log("Raw Gemini response:", text);

        let data;
        try {
            data = JSON.parse(text); // only parse if valid JSON
        } catch {
            return res.status(500).json({ error: "Gemini returned invalid JSON", raw: text });
        }

        const analysisText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Gemini did not return a result.";

        res.json({ result: analysisText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gemini request failed", details: err.message });
    }
});



// Add a Calendar event (from frontend / Gemini result)
app.post("/calendar", async (req, res) => {
    try {
        const { summary, description, startDateTime, endDateTime } = req.body;

        const event = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary,
                description,
                start: { dateTime: startDateTime, timeZone: "America/Toronto" },
                end: { dateTime: endDateTime, timeZone: "America/Toronto" }
            }
        });

        res.json({ success: true, event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Calendar insert failed", details: err.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
