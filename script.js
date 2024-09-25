const API_KEY = 'api AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U'; // Replace with your API Key
const SPREADSHEET_ID = '1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA; // Replace with your Spreadsheet ID

async function fetchData(sheetName) {
    const range = `${sheetName}!A1:Z100`; // Adjust the range as necessary
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data.values; // This will contain the rows of your sheet
        displayRaceList(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayRaceList(data) {
    const raceListDiv = document.getElementById('raceList');
    // Clear existing race list
    raceListDiv.innerHTML = '';

    // Logic to create your race list based on data
    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const time = row[0]; // Adjust based on your sheet structure
        const track = row[1]; // Adjust based on your sheet structure
        const raceItem = document.createElement('div');
        raceItem.innerHTML = `<a href="#" onclick="loadRatings('${time}', '${track}')">${track} ${time}</a>`;
        raceListDiv.appendChild(raceItem);
    });
}

// Load the FLAT sheet initially when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchData('FLAT'); // Call for the FLAT sheet initially
});

// Function to load ratings based on time and track
function loadRatings(time, track) {
    const ratingsTable = document.getElementById('ratingsTable');
    ratingsTable.innerHTML = ''; // Clear existing ratings

    // Fetch ratings from the specific sheet (implement this based on your needs)
    fetchData('FLAT'); // Fetch the FLAT ratings again, or you can implement logic for NH ratings
}
