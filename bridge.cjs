const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const fs = require('fs');

// 1. Identify your Arduino port (check Arduino IDE -> Tools -> Port)
// On Windows: 'COM3', 'COM4', etc. | On Mac: '/dev/tty.usbmodem...'
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
  console.log('Arduino:', data);
  
  // 2. Create the status object based on Arduino output
  const status = { 
    isPillPresent: data.trim() === "PILL_PRESENT" 
  };
  
  // 3. Save to a file in the 'src' folder so React can import it
  fs.writeFileSync('./src/sensorStatus.json', JSON.stringify(status));
});