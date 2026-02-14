import fetch from "node-fetch";
import "dotenv/config";

const GEMINI_MODEL = "models/gemini-2.5-pro";

async function testGemini() {
    const prompt = "What color is the sky?";

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            }
        );

        const text = await res.text();
        console.log("Raw Gemini response:", text);

        const data = JSON.parse(text);
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Gemini result:", result);
    } catch (err) {
        console.error("Error calling Gemini:", err);
    }
}

testGemini();
