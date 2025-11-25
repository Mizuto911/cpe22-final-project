#include <Wire.h>
#include <ClosedCube_MAX30205.h>
#include <MAX30105.h>
#include <heartRate.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define MONITOR_UUID "b0f4ae30-32bb-48b4-94d7-4c6919ba87f7"
#define MONITOR_CHARACTERISTIC_UUID "f8162892-960d-4198-bbdf-0044d4da1052"
#define COMMAND_CHARACTERISTIC_UUID "2eb13ad7-2b5f-4aec-ab5f-7b97adfd64fd"
#define SUMMARY_CHARACTERISTIC_UUID "067dcd65-ab22-4b60-be7f-9597a279b304"

const unsigned long MEASURE_WINDOW_MS = 30000;
const unsigned long SAMPLE_INTERVAL_MS = 1000;

#define MAX30205_ADDR 0x48

ClosedCube_MAX30205 tempSensor;
MAX30105 heartRateSensor;

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

#define BPM_ARRAY_SIZE 30

long lastBeatTime = 0;
int bpm = 0;
byte bpmArray[BPM_ARRAY_SIZE];
byte bpmSpot = 0;

int restingHR = 0;
int hr_after_ex = 0;
int hr_after_1min = 0;

float readTemperatureC();
void sendReading(int bpm);
void sendReading(float tempC, int bpm);
void sendSummary(unsigned long training_s, int resting, int hr_after, int hr_1min, int recovery);

void handleCommand(std::string cmd) {
  String command = String(cmd.c_str());
  command.trim();

  unsigned long now = millis();

  if (command.equalsIgnoreCase("START") && state == IDLE) {
    state = MEASURING_REST;
    stateStartMillis = now;
    Serial.println("Measuring Resting HR for 30 seconds...");
  }
  else if (command.equalsIgnoreCase("STOP") && state == TRAINING) {
    state = STOPPED;
    Serial.println("STOP Received, Stopping training and calculating HR after exercise.");
    hr_after_ex = bpm;
    Serial.printf("HR After Exercise (last window): %d bpm\n", hr_after_ex);
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
    Serial.println("onWrite Callback Triggered");
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
  Wire.begin(13, 14);

  tempSensor.begin(MAX30205_ADDR);
  heartRateSensor.begin(Wire, I2C_SPEED_FAST);
  Serial.println("MAX30205 initialized with ClosedCube library.");

  BLEDevice::init("VitalSphereDevice");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MonitorServerCallbacks());

  BLEService *pService = pServer->createService(MONITOR_UUID);

  pMonitorCharacteristic = pService->createCharacteristic(MONITOR_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pMonitorCharacteristic->addDescriptor(new BLE2902());

  pCommandCharacteristic = pService->createCharacteristic(COMMAND_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_WRITE);
  pCommandCharacteristic->setCallbacks(new CommandCharacteristicCallbacks());

  pSummaryCharacteristic = pService->createCharacteristic(SUMMARY_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pSummaryCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(MONITOR_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  heartRateSensor.setup();
  heartRateSensor.setPulseAmplitudeRed(0x0A);
  heartRateSensor.setPulseAmplitudeGreen(0);

  Serial.println("BLE Server Ready. Advertising as VitalSphereDevice");
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
      long irValue = heartRateSensor.getIR();

      if (checkForBeat(irValue)) {
        long delta = now - lastBeatTime;
        lastBeatTime = now;

        bpm = 60 / (delta/1000.0);

        if (bpm < 255 && bpm > 20) {
          bpmArray[bpmSpot] = bpm;
          bpmSpot = (bpmSpot + 1) % BPM_ARRAY_SIZE;
        }

        Serial.println("Beat Counted!");
      }

      if (now - stateStartMillis >= MEASURE_WINDOW_MS) {
        restingHR = getBPMAverage(bpmArray);
        sendReading(restingHR);
        
        state = TRAINING;
        trainingStartMillis = now;
        stateStartMillis = now; 
        lastSampleMillis = now - SAMPLE_INTERVAL_MS; 
        Serial.println("Training started. Sending 10s readings...");
      }
    } break;

    case TRAINING: {
      long irValue = heartRateSensor.getIR();

      if (checkForBeat(irValue)) {
        long delta = now - lastBeatTime;
        lastBeatTime = now;

        bpm = 60 / (delta/1000.0);

        Serial.println("Beat Counted!");
      }

      if (now - lastSampleMillis >= SAMPLE_INTERVAL_MS) {
        float temp = readTemperatureC();
        sendReading(temp, bpm);
        lastSampleMillis = now;
      }
    } break;

    case STOPPED:
      state = HR_RECOVERY_WAIT;
      stateStartMillis = now;
      Serial.println("Starting Resting Period of HR Recovery measurement...");
      break;

    case HR_RECOVERY_WAIT:
      if (now - stateStartMillis >= 60000) { 
        stateStartMillis = now;
        state = HR_RECOVERY_MEASURE;
        lastBeatTime = now;
        bpmSpot = 0;
        Serial.println("Starting 10s HR recovery measurement...");
      }
      break;

    case HR_RECOVERY_MEASURE: {
      long irValue = heartRateSensor.getIR();

      if (checkForBeat(irValue)) {
        long delta = now - lastBeatTime;
        lastBeatTime = now;

        bpm = 60 / (delta / 1000.0);

        if (bpm < 255 && bpm > 20) {
          bpmArray[bpmSpot] = bpm;
          bpmSpot = (bpmSpot + 1) % BPM_ARRAY_SIZE;
        }

        Serial.println("Beat Counted!");
      }

      if (now - stateStartMillis >= MEASURE_WINDOW_MS) { 
        hr_after_1min = getBPMAverage(bpmArray); 
        int recovery = hr_after_ex - hr_after_1min;
        
        unsigned long total_training_duration_ms = now - trainingStartMillis;
        unsigned long training_s = total_training_duration_ms / 1000;

        sendSummary(training_s, restingHR, hr_after_ex, hr_after_1min, recovery);
        state = IDLE;
        Serial.println("Training session complete.");
      }
    } break;

    default: break;
  }

  delay(25);
}

float readTemperatureC() {
  return tempSensor.readT(); 
}

void sendReading(int bpm) {
  if (deviceConnected) {
    char buf[120];
    snprintf(buf, sizeof(buf), "{\"resting_bpm\":%d}", bpm);

    std::string payload(buf);
    const char* c_str_payload = payload.c_str();
    size_t len = payload.length();
    pMonitorCharacteristic->setValue((const uint8_t*)c_str_payload, len + 1);
    pMonitorCharacteristic->notify();

    Serial.printf("Resting HR: %d bpm\n", bpm);
  }
}

void sendReading(float tempC, int bpm) {
  if (deviceConnected) {
    char buf[120];
    snprintf(buf, sizeof(buf), "{\"temp_c\":%.2f,\"bpm\":%d}", tempC, bpm);

    std::string payload(buf);
    const char* c_str_payload = payload.c_str();
    size_t len = payload.length();
    pMonitorCharacteristic->setValue((const uint8_t*)c_str_payload, len + 1);
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
    pSummaryCharacteristic->setValue((const uint8_t*)c_str_payload, len + 1);
    pSummaryCharacteristic->notify();
    
    Serial.printf("[TX SUMMARY] %s\n", buf);
  }
}

int getBPMAverage(byte bpmArray[]) {
  int sum = 0;
  for (byte i = 0; i < BPM_ARRAY_SIZE; i++) {
    sum += bpmArray[i];
  }
  return sum / BPM_ARRAY_SIZE;
}
