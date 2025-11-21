const WebSocket = require('ws');
const http = require('http');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    console.log('Connected to WebSocket');
});

ws.on('message', function incoming(data) {
    console.log('Received via WebSocket:', data.toString());
});

// Simulate ESP32 sending data after 2 seconds
setTimeout(() => {
    console.log('Sending POST request to /update-location...');
    const data = JSON.stringify({
        lat: 11.03,
        lng: 76.98
    });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/update-location',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`POST Response Status: ${res.statusCode}`);
        res.on('data', (d) => {
            console.log('POST Response Body:', d.toString());
        });
    });

    req.on('error', (error) => {
        console.error('POST Error:', error);
    });

    req.write(data);
    req.end();

}, 2000);
