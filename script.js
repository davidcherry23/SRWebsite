const API_KEY = 'AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U'; // Your API Key
const SPREADSHEET_ID = '1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA'; // Your Spreadsheet ID

async function fetchData(sheetName) {
    const range = `${sheetName}!A1:Z100`; // Adjust the range as necessary
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.values; // Return the rows of your sheet
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

async function loadRaceList() {
    const flatData = await fetchData('FLAT');
    const nhData = await fetchData('NH');
    
    const raceList = {}; // Use an object to group by track

    // Process FLAT data
    flatData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0];
        const track = row[1];
        if (!raceList[track]) {
            raceList[track] = [];
        }
        raceList[track].push(time); // Add time to the respective track
    });

    // Process NH data
    nhData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0];
        const track = row[1];
        if (!raceList[track]) {
            raceList[track] = [];
        }
        raceList[track].push(time); // Add time to the respective track
    });

    displayRaceList(raceList); // Pass the entire object to display
}

function displayRaceList(data) {
    const raceListDiv = document.getElementById('raceList');
    raceListDiv.innerHTML = ''; // Clear existing race list

    // Create race list based on grouped data
    for (const track in data) {
        const trackDiv = document.createElement('div');
        trackDiv.innerHTML = `<strong>${track}</strong>`; // Track name as a heading
        const timeList = document.createElement('div');

        data[track].forEach(time => {
            const raceItem = document.createElement('a');
            raceItem.href = `ratings.html?time=${time}&track=${encodeURIComponent(track)}`; // Link to ratings page
            raceItem.innerHTML = ` ${time}`;
            timeList.appendChild(raceItem);
        });

        trackDiv.appendChild(timeList);
        raceListDiv.appendChild(trackDiv); // Append track and time list to the main div
    }
}

// Load the race list when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadRaceList);
