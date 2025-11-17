export function hasEmptyFields(formData: FormData): boolean {
    return !formData.get('username') || !formData.get('password');
}

export async function connectDevice(device: BluetoothDevice) {
    if (!device.gatt) return;
    if (device.gatt.connected) return;

    const server = await device.gatt.connect();
    const heartRate = await server.getPrimaryService('heart_rate');
    const bodyTemp = await server.getPrimaryService(0x1809);

    const heartRateChar = await heartRate.getCharacteristic('heart_rate_measurement');
    const bodyTempChar = await bodyTemp.getCharacteristic(0x2A1C);

    return {heartRate: heartRateChar, bodyTemp: bodyTempChar};
}

export async function requestDevice() {
    const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', 0x1809]
    });
    device.addEventListener('gattserverdisconnected', () => connectDevice(device));
    return device;
}

export async function startMonitoring(char: BluetoothRemoteGATTCharacteristic) {
    await char.startNotifications();
}

export async function stopMonitoring(char: BluetoothRemoteGATTCharacteristic) {
    await char.stopNotifications();
}

export function parseData(value: DataView) {
    const is16Bits = value.getUint8(0) & 0x1;
    return is16Bits ? value.getUint16(1, true) : value.getUint8(1);
}

export async function supportsBluetooth() {
    if (!('bluetooth' in navigator)) {
        console.log('Bluetooth is not Supported by this Browser.')
        return false;
    }
    console.log('Bluetooth is supported by this Browser.')
    return await navigator.bluetooth.getAvailability();
}