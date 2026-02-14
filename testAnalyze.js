import fetch from "node-fetch";

const prompt = "What color is the sky?";

fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
})
    .then(res => res.json())
    .then(data => console.log("Gemini Result:", data))
    .catch(err => console.error(err));
