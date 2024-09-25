const API_KEY = 'AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U'; // Your API Key
const SPREADSHEET_ID = '1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA'; // Your Spreadsheet ID

async function fetchData(sheetName) {
    console.log(`Fetching data for sheet: ${sheetName}`);
    const range = `${sheetName}!A1:Z100`; // Adjust the range as necessary
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log('Data fetched successfully:', response.data);
        return response.data.values; // Return the rows of your sheet
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

async function loadRaceList() {
    const flatData = await fetchData('FLAT');
    const nhData = await fetchData('NH');
    
    const raceList = new Map(); // Use a Map to avoid duplicate times

    // Process FLAT data
    flatData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0];
        const track = row[1];
        raceList.set(`${track} ${time}`, { track, time }); // Store unique time-track pairs
    });

    // Process NH data
    nhData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0];
        const track = row[1];
        raceList.set(`${track} ${time}`, { track, time }); // Store unique time-track pairs
    });

    displayRaceList(Array.from(raceList.values())); // Convert Map back to array for display
}

function displayRaceList(data) {
    const raceListDiv = document.getElementById('raceList');
    // Clear existing race list
    raceListDiv.innerHTML = '';

    // Create race list based on unique data
    data.forEach(({ track, time }) => {
        const raceItem = document.createElement('div');
        raceItem.innerHTML = `<a href="#" onclick="loadRatings('${time}', '${track}')">${track} ${time}</a>`;
        raceListDiv.appendChild(raceItem);
    });
}

// Load the race list when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadRaceList);

// Function to load ratings based on time and track
async function loadRatings(time, track) {
    const ratingsTable = document.getElementById('ratingsTable');
    ratingsTable.innerHTML = ''; // Clear existing ratings

    // Fetch ratings from the FLAT sheet (you can implement logic for NH ratings here as needed)
    const flatData = await fetchData('FLAT');
    const nhData = await fetchData('NH');

    // Combine data to find the correct race ratings
    const combinedData = [...flatData, ...nhData];

    // Find and display ratings for the selected race
    combinedData.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        if (row[0] === time && row[1] === track) { // Match time and track
            const newRow = document.createElement('tr');
            row.forEach(cell => {
                const newCell = document.createElement('td');
                newCell.textContent = cell;
                newRow.appendChild(newCell);
            });
            ratingsTable.appendChild(newRow);
        }
    });
}
