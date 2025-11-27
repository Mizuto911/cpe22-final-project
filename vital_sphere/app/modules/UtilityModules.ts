export function hasEmptyFields(formData: FormData): boolean {
    return !formData.get('username') || !formData.get('password');
}

export const formatDateToISOStringLocally = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export async function connectDevice(device: BluetoothDevice) {
    if (!device.gatt) return;
    if (device.gatt.connected) return;

    const server = await device.gatt.connect();
    const monitor = await server.getPrimaryService('b0f4ae30-32bb-48b4-94d7-4c6919ba87f7');

    const monitorChar = await monitor.getCharacteristic('f8162892-960d-4198-bbdf-0044d4da1052');
    const commandChar = await monitor.getCharacteristic('2eb13ad7-2b5f-4aec-ab5f-7b97adfd64fd');
    const summaryChar = await monitor.getCharacteristic('067dcd65-ab22-4b60-be7f-9597a279b304');

    return {monitor: monitorChar, command: commandChar, summary: summaryChar};
}

export async function requestDevice(setDevice: Function) {
    const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['b0f4ae30-32bb-48b4-94d7-4c6919ba87f7', 0x1809]
    });
    device.addEventListener('gattserverdisconnected', () => setDevice(null));
    return device;
}

export async function disconnectDevice(device: BluetoothDevice, setDevice: Function) {
    device.gatt?.disconnect();
    setDevice(null);
}

export async function startMonitoring(char: BluetoothRemoteGATTCharacteristic) {
    await char.startNotifications();
}

export async function stopMonitoring(char: BluetoothRemoteGATTCharacteristic) {
    await char.stopNotifications();
}

export async function changeTrainingState(cmdChar: BluetoothRemoteGATTCharacteristic, command: string) {
    const encoder = new TextEncoder();
    const value = encoder.encode(command);
    await cmdChar.writeValue(value);
}

export function parseData(value: DataView) {
    const is16Bits = value.getUint8(0) & 0x1;
    return is16Bits ? value.getUint16(1, true) : value.getUint8(1);
}

export async function supportsBluetooth() {
    if (!('bluetooth' in navigator)) {
        console.log('Bluetooth is not Supported by this Browser.');
        return false;
    }
    const available = await navigator.bluetooth.getAvailability();
    if (available)
        console.log('Bluetooth is supported by this Browser.');
    return available;
}

export async function uploadMeasurement(measurement: object) {
    const response = await fetch('http://localhost:8000/measurements/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify(measurement)
    });

    try {
        if (response.ok) {
            const data = await response.json();
            return {ok: true, overworked: data.overworked};
        }
        else {
            const error = await response.json();
            return {ok: false, message: error.message};
        }
    }
    catch (e) {
        console.log(`Measurement Upload Failed: ${e}`);
        return {ok: false, message: 'Unable to Connect to Server'};
    }
}

export async function uploadFatigueData(fatigueData: object) {
    const response = await fetch('http://localhost:8000/fatiguedata/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify(fatigueData)
    });

    try {
        if (response.ok) {
            const data = await response.json();
            return {ok: true, fatigue_risk: data.fatigue_risk};
        }
        else {
            const error = await response.json();
            return {ok: false, message: error.message};
        }
    }
    catch (e) {
        console.log(`Measurement Upload Failed: ${e}`);
        return {ok: false, message: 'Unable to Connect to Server'};
    }
}

export function decodeBluetoothData(char: BluetoothRemoteGATTCharacteristic) {
    const decoder = new TextDecoder();
    const value = char.value;
    if (!value) return;
    const dataArray = new Uint8Array(value.buffer);
    const dataString = decoder.decode(dataArray);

    try {
        return JSON.parse(dataString);
    }
    catch (e) {
        console.log(`Error Parsing Data: ${e}`);
    }
}

export function getTimerDisplay(timer: number) {
    const seconds = timer % 60;
    const minutes = Math.floor((timer % 3600) / 60);
    const hours = Math.floor(timer / 3600);
    const pad = (num: number) => num.toString().padStart(2,'0'); 
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}