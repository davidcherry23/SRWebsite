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
            raceList[track] = new Set(); // Use a Set to avoid duplicate times
        }
        raceList[track].add(time); // Add time to the Set
    });

    // Process NH data
    nhData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0];
        const track = row[1];
        if (!raceList[track]) {
            raceList[track] = new Set(); // Use a Set to avoid duplicate times
        }
        raceList[track].add(time); // Add time to the Set
    });

    // Create the HTML for the race list
    const raceListDiv = document.getElementById('raceList');
    for (const track in raceList) {
        const times = Array.from(raceList[track]); // Convert Set back to array
        const timesHTML = times.map(time => `<a href="ratings.html?track=${encodeURIComponent(track)}&time=${encodeURIComponent(time)}">${time}</a>`).join(' ');
        raceListDiv.innerHTML += `<div><strong>${track}</strong> ${timesHTML}</div>`;
    }
}

// Call the loadRaceList function to populate the page
loadRaceList();
