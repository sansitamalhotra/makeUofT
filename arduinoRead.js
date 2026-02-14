import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// 1. CHANGE THIS to the port you saw in the Arduino IDE (e.g., 'COM3' or '/dev/cu.usbmodem...')
const ARDUINO_PORT = 'COM3'; 

const port = new SerialPort({ 
    path: ARDUINO_PORT, 
    baudRate: 9600 
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log(`--- Listening to Arduino on ${ARDUINO_PORT} ---`);

// This prints the Arduino output directly to your VS Code terminal
parser.on('data', (data) => {
    console.log('Arduino says:', data);
});

port.on('error', (err) => {
    console.log('Error: ', err.message);
});