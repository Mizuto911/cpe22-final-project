export async function getMeasurementData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/measurements/measurements`, {
            headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
        }
        });
        if (response.ok) {
            const measurement = await response.json();
            return measurement
        }
        else {
            console.log('Measurement Fetch Failed');
            return null;
        }
    }
    catch (e) {
        console.log('Unable to Connect Server');
        return null;
    }
}

export async function getFatigueData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fatiguedata/fatiguedata`, {
            headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
        }
        });
        if (response.ok) {
            const fatigueData = await response.json();
            return fatigueData
        }
        else {
            console.log('Measurement Fetch Failed');
            return null;
        }
    }
    catch (e) {
        console.log('Unable to Connect Server');
        return null;
    }
}

export async function getStatistics() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/measurements/statistics`, {
            headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
        }
        });
        if (response.ok) {
            const dataStat = await response.json();
            return dataStat;
        }
        else {
            console.log('Statistics Fetch Failed');
            return null;
        }
    }
    catch (e) {
        console.log('Unable to Connect to Server');
        return null;
    }
}