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
