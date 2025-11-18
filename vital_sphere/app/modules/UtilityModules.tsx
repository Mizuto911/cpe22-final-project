export function hasEmptyFields(formData: FormData): boolean {
    return !formData.get('username') || !formData.get('password');
}

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

export function parseData(value: DataView) {
    const is16Bits = value.getUint8(0) & 0x1;
    return is16Bits ? value.getUint16(1, true) : value.getUint8(1);
}

export async function supportsBluetooth() {
    if (!('bluetooth' in navigator)) {
        console.log('Bluetooth is not Supported by this Browser.');
        return false;
    }
    console.log('Bluetooth is supported by this Browser.');
    return await navigator.bluetooth.getAvailability();
}