#include <Wire.h>
#include <Preferences.h> 
#include <ClosedCube_MAX30205.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define MONITOR_UUID "b0f4ae30-32bb-48b4-94d7-4c6919ba87f7"
#define MONITOR_CHARACTERISTIC_UUID "f8162892-960d-4198-bbdf-0044d4da1052"
#define COMMAND_CHARACTERISTIC_UUID "2eb13ad7-2b5f-4aec-ab5f-7b97adfd64fd"
#define SUMMARY_CHARACTERISTIC_UUID "067dcd65-ab22-4b60-be7f-9597a279b304"

const int PULSE_PIN = 34; 
const int PULSE_THRESHOLD = 3250;
bool flag = false;

const unsigned long RESTING_MEASURE_MS = 30000;
const unsigned long SAMPLE_INTERVAL_MS = 10000;

#define MAX30205_ADDR 0x48

Preferences prefs;
ClosedCube_MAX30205 tempSensor;

BLEServer* pServer = NULL;
BLECharacteristic* pMonitorCharacteristic = NULL;
BLECharacteristic* pCommandCharacteristic = NULL;
BLECharacteristic* pSummaryCharacteristic = NULL;
bool deviceConnected = false;

enum TrainerState { IDLE, MEASURING_REST, TRAINING, STOPPED, HR_RECOVERY_WAIT, HR_RECOVERY_MEASURE };
TrainerState state = IDLE;

unsigned long stateStartMillis = 0;
unsigned long trainingStartMillis = 0;
unsigned long lastSampleMillis = 0;

int restingHR = 0;
int hr_after_ex = 0;
int hr_after_1min = 0;

int beatsCounted = 0;

float readTemperatureC();
void sendReading(float tempC, int bpm);
void sendSummary(unsigned long training_s, int resting, int hr_after, int hr_1min, int recovery);

void handleCommand(std::string cmd) {
  String command = String(cmd.c_str());
  command.trim();

  unsigned long now = millis();

  if (command.equalsIgnoreCase("START") && state == IDLE) {
    state = MEASURING_REST;
    stateStartMillis = now;
    beatsCounted = 0;
    Serial.println("Measuring Resting HR for 30 seconds...");
  }
  else if (command.equalsIgnoreCase("STOP") && state == TRAINING) {
    state = STOPPED;
    Serial.println("STOP Received, Stopping training and calculating HR after exercise.");

    int bpm_window = 0;
    if (beatsCounted > 0) {
      unsigned long windowDuration = now - lastSampleMillis;
      float windowSeconds = windowDuration / 1000.0f;
      bpm_window = (int)((float)beatsCounted*(60.0f/windowSeconds));
    }
    hr_after_ex = bpm_window;
    Serial.printf("HR After Exercise (last window): %d bpm\n", hr_after_ex);
    beatsCounted = 0;
    Serial.println("Waiting 1 min for HR Recovery...");
  }
  else {
    Serial.printf("[CMD] Unknown Command %s\n", command.c_str());
  }
}

class MonitorServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Monitor Device Connected");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    BLEDevice::startAdvertising();
    Serial.println("Monitor Device Disconnected, Restarting Advertising");
  }
};

class CommandCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    String value = pCharacteristic->getValue();

    if (value.length() > 0) {
      Serial.println("[BT RX] Received Command: ");
      for (int i = 0; i < value.length(); i++) {
        Serial.print(value[i]);
      }
      Serial.println();
      handleCommand(value.c_str());
    }
  }
};

void setup() {
  Serial.begin(115200);
  delay(100);
  Wire.begin(21, 22);

  tempSensor.begin(MAX30205_ADDR); 
  Serial.println("MAX30205 initialized with ClosedCube library.");
  
  prefs.begin("trainer_data", false);
  unsigned long storedDuration = prefs.getULong("total_train_s", 0);
  Serial.printf("Total stored training duration: %lu seconds\n", storedDuration);
  prefs.end();

  BLEDevice::init("VitalSphereDevice");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MonitorServerCallbacks());

  BLEService *pService = pServer->createService(MONITOR_UUID);

  pMonitorCharacteristic = pService->createCharacteristic(MONITOR_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pMonitorCharacteristic->addDescriptor(new BLE2902());

  pCommandCharacteristic = pService->createCharacteristic(COMMAND_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_WRITE);

  pSummaryCharacteristic = pService->createCharacteristic(SUMMARY_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pSummaryCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(MONITOR_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("BLE SErver Ready. Advertising as VitalSphereDevice");
  Serial.println("Waiting for START command...");
}

void loop() {

  if (!deviceConnected) {
    delay(500);
    return;
  }

  unsigned long now = millis();

  switch (state) {
    case MEASURING_REST: {
      int val = analogRead(PULSE_PIN);
      Serial.println(String(val) + "," + String(PULSE_THRESHOLD));
      if (val > PULSE_THRESHOLD && !flag) {
        beatsCounted++;
        flag = true;
        Serial.println("Beat Counted: " + String(beatsCounted));
      }
      else if (val < PULSE_THRESHOLD) {
        flag = false;
      }

      if (now - stateStartMillis >= RESTING_MEASURE_MS) {
        restingHR = beatsCounted * 2;
        Serial.printf("Resting HR: %d bpm\n", restingHR);
        
        state = TRAINING;
        trainingStartMillis = now;
        stateStartMillis = now; 
        lastSampleMillis = now - SAMPLE_INTERVAL_MS; 
        beatsCounted = 0;
        Serial.println("Training started. Sending 10s readings...");
      }
    } break;

    case TRAINING: {
      int val = analogRead(PULSE_PIN);
      if (val > PULSE_THRESHOLD && !flag) {
        beatsCounted++;
        flag = true;
        Serial.println("Beat Counted: " + String(beatsCounted));
      }
      else if (val < PULSE_THRESHOLD) {
        flag = false;
      }

      if (now - lastSampleMillis >= SAMPLE_INTERVAL_MS) {
        int bpm = beatsCounted * 6; 
        float temp = readTemperatureC();
        sendReading(temp, bpm);
        
        beatsCounted = 0; 
        lastSampleMillis = now;
      }
    } break;

    case STOPPED:
      state = HR_RECOVERY_WAIT;
      Serial.println("Please Wait One Minute!");
      break;

    case HR_RECOVERY_WAIT:
      if (now - stateStartMillis >= 60000) { 
        beatsCounted = 0;
        stateStartMillis = now;
        state = HR_RECOVERY_MEASURE;
        Serial.println("Starting 10s HR recovery measurement...");
      }
      break;

    case HR_RECOVERY_MEASURE: {
      int val = analogRead(PULSE_PIN);
      if (val > PULSE_THRESHOLD && !flag) {
        beatsCounted++;
        flag = true;
        Serial.println("Beat Counted: " + String(beatsCounted));
      }
      else if (val < PULSE_THRESHOLD) {
        flag = false;
      }

      if (now - stateStartMillis >= SAMPLE_INTERVAL_MS) { 
        hr_after_1min = beatsCounted * 6; 
        int recovery = hr_after_ex - hr_after_1min;
        
        unsigned long total_training_duration_ms = now - trainingStartMillis;
        unsigned long training_s = total_training_duration_ms / 1000;
        
        prefs.begin("trainer_data", false);
        unsigned long storedDuration = prefs.getULong("total_train_s", 0);
        prefs.putULong("total_train_s", storedDuration + training_s);
        prefs.end();

        sendSummary(training_s, restingHR, hr_after_ex, hr_after_1min, recovery);
        state = IDLE;
        Serial.println("Training session complete. Preferences updated.");
      }
    } break;

    default: break;
  }

  delay(25);
}

float readTemperatureC() {
  return tempSensor.readT(); 
}

void sendReading(float tempC, int bpm) {
  if (deviceConnected) {
    char buf[120];
    snprintf(buf, sizeof(buf), "{\"temp_c\":%.2f,\"bpm\":%d}", tempC, bpm);

    std::string payload(buf);
    const char* c_str_payload = payload.c_str();
    size_t len = payload.length();
    pMonitorCharacteristic->setValue((const uint8_t*)c_str_payload, len);
    pMonitorCharacteristic->notify();

    Serial.printf("[TX DATA] %s\n", buf);
  }
  
}

void sendSummary(unsigned long training_s, int resting, int hr_after, int hr_1min, int recovery) {
  if (deviceConnected) {
    char buf[200];
    snprintf(buf, sizeof(buf),
            "{\"summary\":{\"training_s\":%lu,\"resting_hr\":%d,\"hr_after\":%d,\"hr_1min\":%d,\"recovery\":%d}}",
            training_s, resting, hr_after, hr_1min, recovery);

    std::string payload(buf);
    const char* c_str_payload = payload.c_str();
    size_t len = payload.length();
    pSummaryCharacteristic->setValue((const uint8_t*)c_str_payload, len);
    pSummaryCharacteristic->notify();
    
    Serial.printf("[TX SUMMARY] %s\n", buf);
  }
  
}
