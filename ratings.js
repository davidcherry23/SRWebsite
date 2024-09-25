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

async function loadRatings() {
    const params = new URLSearchParams(window.location.search);
    const time = params.get('time');
    const track = params.get('track');

    const ratingsBody = document.getElementById('ratingsBody');
    ratingsBody.innerHTML = ''; // Clear existing ratings

    // Show the ratings table
    const ratingsTable = document.getElementById('ratingsTable');
    ratingsTable.style.display = 'table'; // Show the table when loading ratings

    // Fetch ratings from the FLAT sheet and NH sheet
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
            ratingsBody.appendChild(newRow);
        }
    });
}

// Load ratings when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadRatings);
