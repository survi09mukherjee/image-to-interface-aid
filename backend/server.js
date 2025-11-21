const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Station Data (Synced with Frontend)
const stations = [
    {
        id: "cbe",
        name: "Coimbatore Junction",
        code: "CBE",
        coordinates: { lat: 11.018, lng: 76.970 }
    },
    {
        id: "cbf",
        name: "Coimbatore North Junction",
        code: "CBF",
        coordinates: { lat: 11.039, lng: 76.983 }
    },
    {
        id: "ptj",
        name: "Podanur Junction",
        code: "PTJ",
        coordinates: { lat: 10.974, lng: 76.933 }
    },
    {
        id: "shi",
        name: "Singanallur",
        code: "SHI",
        coordinates: { lat: 11.005, lng: 76.991 }
    }
];

// Internal State
let currentGPS = { lat: 11.018, lng: 76.970 }; // Default to CBE
let nearestStation = { name: "Coimbatore Junction", distance: 0, lat: 11.018, lng: 76.970 };
let signals = {
    "track-up": { left: "safe", right: "safe" },
    "track-down": { left: "safe", right: "safe" }
};
let emergencyStop = null; // { trainId, timestamp }

// Haversine Distance Calculation (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function updateNearestStation(lat, lng) {
    let minDistance = Infinity;
    let nearest = null;

    stations.forEach(station => {
        const dist = getDistanceFromLatLonInKm(lat, lng, station.coordinates.lat, station.coordinates.lng);
        if (dist < minDistance) {
            minDistance = dist;
            nearest = station;
        }
    });

    if (nearest) {
        nearestStation = {
            name: nearest.name,
            distance: parseFloat(minDistance.toFixed(2)),
            lat: nearest.coordinates.lat,
            lng: nearest.coordinates.lng
        };
    }
}

// HTTP Server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    // Send initial state
    ws.send(JSON.stringify({
        lat: currentGPS.lat,
        lng: currentGPS.lng,
        nearestStation,
        signals,
        emergencyStop
    }));

    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});

// API Endpoints

// POST /update-location
// Body: { lat: number, lng: number }
app.post('/update-location', (req, res) => {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
        return res.status(400).json({ error: 'Missing lat or lng' });
    }

    currentGPS = { lat, lng };
    updateNearestStation(lat, lng);

    const updateData = {
        type: 'LOCATION_UPDATE',
        lat,
        lng,
        nearestStation
    };

    broadcast(updateData);
    res.json({ success: true, data: updateData });
});

// POST /update-signal
// Body: { trackId, left?, right? }
app.post('/update-signal', (req, res) => {
    const { trackId, left, right } = req.body;
    if (!trackId || (!left && !right)) {
        return res.status(400).json({ error: 'Missing trackId or signal state' });
    }

    if (!signals[trackId]) {
        return res.status(404).json({ error: 'Track ID not found' });
    }

    if (left) signals[trackId].left = left;
    if (right) signals[trackId].right = right;

    const updateData = {
        type: 'SIGNAL_UPDATE',
        signals
    };

    broadcast(updateData);
    res.json({ success: true, signals });
});

// POST /emergency-stop
// Body: { trainId }
app.post('/emergency-stop', (req, res) => {
    const { trainId } = req.body;
    if (!trainId) {
        return res.status(400).json({ error: 'Missing trainId' });
    }

    emergencyStop = {
        trainId,
        timestamp: new Date().toISOString()
    };

    console.log(`EMERGENCY STOP TRIGGERED FOR TRAIN: ${trainId}`);

    const updateData = {
        type: 'EMERGENCY_STOP',
        trainId,
        timestamp: emergencyStop.timestamp
    };

    broadcast(updateData);
    res.json({ success: true, message: 'Emergency stop triggered' });
});

// GET /live
app.get('/live', (req, res) => {
    res.json({
        currentGPS,
        nearestStation,
        signals,
        emergencyStop
    });
});

app.get('/', (req, res) => {
    res.send('Smart Rail-Tracking Backend is Running');
});
