#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>

// Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your backend URL (e.g., from Railway)
const char* serverName = "https://your-backend-app.up.railway.app/update-location";

// GPS Module connection (Serial2 is common on ESP32)
#define RXD2 16
#define TXD2 17
HardwareSerial gpsSerial(2);
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, RXD2, TXD2);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Dispatch incoming characters
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated()) {
    if(WiFi.status() == WL_CONNECTED){
      HTTPClient http;

      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      String jsonPayload = "{\"lat\": " + String(gps.location.lat(), 6) + ", \"lng\": " + String(gps.location.lng(), 6) + "}";
      
      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
  }
  
  // Send update every 3 seconds
  delay(3000);
}
