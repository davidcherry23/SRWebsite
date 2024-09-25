const SPREADSHEET_ID = '1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA';
const API_KEY = 'AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U';

async function fetchData(sheetName) {
    const range = `${sheetName}!A1:Z600`; // Fetch rows from 1 to 600
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log(`Fetched ${response.data.values.length} rows from ${sheetName}`);
        return response.data.values; // Return the rows of your sheet
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

async function loadRatings() {
    const params = new URLSearchParams(window.location.search);
    const selectedTrack = params.get('track');
    const selectedTime = params.get('time');

    console.log(`Loading ratings for Track: ${selectedTrack}, Time: ${selectedTime}`); // Log the parameters

    const flatData = await fetchData('FLAT');
    const nhData = await fetchData('NH');

    const allData = [...flatData, ...nhData];
    const filteredData = allData.filter(row => row[1] === selectedTrack && row[0] === selectedTime); // Filter based on selected track and time

    console.log(`Filtered Ratings: ${JSON.stringify(filteredData)}`); // Log the filtered data

    const ratingsBody = document.getElementById('ratingsBody');
    ratingsBody.innerHTML = ''; // Clear previous ratings

    if (filteredData.length > 0) {
        filteredData.forEach(row => {
            const ratingRow = `<tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
                <td>${row[5]}</td>
                <td>${row[6]}</td>
                <td>${row[7]}</td>
                <td>${row[8]}</td>
                <td>${row[9]}</td>
                <td>${row[10]}</td>
                <td>${row[11]}</td>
                <td>${row[12]}</td>
                <td>${row[13]}</td>
                <td>${row[14]}</td>
            </tr>`;
            ratingsBody.innerHTML += ratingRow;
        });
    } else {
        ratingsBody.innerHTML = '<tr><td colspan="15">No ratings available for this race.</td></tr>'; // Message if no ratings
    }
}

// Call the loadRatings function to populate the ratings table
loadRatings();
