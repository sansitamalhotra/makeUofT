const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const fs = require('fs');
const path = require('path');


// 1. Setup the port (Change COM3 to your actual port)
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// 2. Define exactly where the JSON file is
// This tells Node to look in the current folder, then into 'src', then find the file
const statusFilePath = path.join(__dirname, 'src', 'sensorStatus.json');

parser.on('data', (data) => {
  console.log('Arduino says:', data);
  
  // Expecting format "0:HIGH" or "0:LOW" from Arduino
  const [idStr, state] = data.trim().split(':');
  const id = parseInt(idStr);
  const pillCount = (state === "HIGH") ? 1 : 0;

  try {
    // Read the current file
    const fileData = JSON.parse(fs.readFileSync(statusFilePath, 'utf8'));
    
    // Update the specific sensor
    const sensor = fileData.sensors.find(s => s.id === id);
    if (sensor) {
      sensor.pillCount = pillCount;
      sensor.lastInteraction = new Date().toLocaleTimeString();
    }

    // Save it back
    fs.writeFileSync(statusFilePath, JSON.stringify(fileData, null, 2));
  } catch (err) {
    console.error("Error updating JSON:", err);
  }
});