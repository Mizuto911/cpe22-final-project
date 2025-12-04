export async function getMeasurementData() {
    try {
        const response = await fetch('http://localhost:8000/measurements/measurements', {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}
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
        const response = await fetch('http://localhost:8000/fatiguedata/fatiguedata', {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}
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
        const response = await fetch('http://localhost:8000/measurements/statistics', {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}
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