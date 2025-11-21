const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- STATION LIST --------------------
const stations = [
  { name: "Coimbatore Junction", lat: 11.0168, lng: 76.9558 },
  { name: "Peelamedu", lat: 11.0308, lng: 77.0431 },
  { name: "Podanur", lat: 10.9766, lng: 76.9661 },
  { name: "Singanallur", lat: 11.0187, lng: 77.0075 },
];

// ----------------------- UTILS ------------------------
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest station
function getNearestStation(lat, lng) {
  let minDist = Infinity;
  let nearestStation = null;

  stations.forEach(st => {
    const dist = calculateDistance(lat, lng, st.lat, st.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestStation = { ...st, distance: dist };
    }
  });

  return nearestStation;
}

// -------------------- WEBSOCKET SERVER --------------------
const wss = new WebSocket.Server({ port: 8081 });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// -------------------- POST ENDPOINT FOR ESP32 --------------------
app.post("/update-location", (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat & lng required" });
  }

  const nearest = getNearestStation(lat, lng);

  const payload = {
    lat,
    lng,
    nearestStation: nearest
  };

  // Send live update to frontend
  broadcast(payload);

  console.log("Received from ESP32:", payload);

  res.json({ status: "OK", received: payload });
});

// ---------------------- START SERVER -----------------------
app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
console.log("WebSocket running on port 8081");
