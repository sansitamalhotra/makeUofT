import fetch from "node-fetch";

fetch("http://localhost:3000/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        summary: "Console Test Event",
        description: "Created from Node console",
        startDateTime: "2026-02-14T09:00:00-05:00",
        endDateTime: "2026-02-14T09:05:00-05:00"
    })
})
    .then(res => res.json())
    .then(data => console.log("Calendar Event Result:", data))
    .catch(err => console.error(err));
