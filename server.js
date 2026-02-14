import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// --- CONFIGURATION ---
// CHANGE THIS TO YOUR ARDUINO PORT (Check Arduino IDE > Tools > Port)
// Windows example: 'COM3'
const ARDUINO_PORT = 'COM3'; 
const BAUD_RATE = 9600;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
  }
});

// 1. Setup Serial Port connection to Arduino
const port = new SerialPort({ path: ARDUINO_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// 2. Listen for data from Arduino
parser.on('data', (data) => {
  console.log('Arduino says:', data);
  
  // Clean up the data string (remove extra whitespace)
  const cleanData = data.trim();

  // Forward the message to the frontend website
  if (cleanData === "MONDAY_PLACED") {
    io.emit('pill-status-change', { day: 'Monday', status: 'placed' });
  } 
  else if (cleanData === "MONDAY_TAKEN") {
    io.emit('pill-status-change', { day: 'Monday', status: 'taken' });
  }
});

// Handle Serial Port Errors
port.on('error', (err) => {
  console.error('Serial Port Error:', err.message);
});

// 3. Start the Server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});