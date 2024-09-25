document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const flatTimes = {};
            const nhTimes = {};
            const ratingsData = []; // To store all ratings data

            // Process FLAT sheet
            const flatSheet = workbook.Sheets['FLAT'];
            if (flatSheet) {
                const flatData = XLSX.utils.sheet_to_json(flatSheet, { header: 1 });
                flatData.slice(1).forEach(row => {
                    if (row.length > 1) {
                        const [time, track] = [row[0], row[1]];
                        if (!flatTimes[track]) {
                            flatTimes[track] = [];
                        }
                        if (!flatTimes[track].includes(time)) {
                            flatTimes[track].push(time);
                        }
                        ratingsData.push(row); // Store the complete row data
                    }
                });
            }

            // Process NH sheet
            const nhSheet = workbook.Sheets['NH'];
            if (nhSheet) {
                const nhData = XLSX.utils.sheet_to_json(nhSheet, { header: 1 });
                nhData.slice(1).forEach(row => {
                    if (row.length > 1) {
                        const [time, track] = [row[0], row[1]];
                        if (!nhTimes[track]) {
                            nhTimes[track] = [];
                        }
                        if (!nhTimes[track].includes(time)) {
                            nhTimes[track].push(time);
                        }
                        ratingsData.push(row); // Store the complete row data
                    }
                });
            }

            // Store ratings data in localStorage for later use
            localStorage.setItem('raceData', JSON.stringify(ratingsData));

            displayRaceList(flatTimes, nhTimes);
        };

        reader.readAsArrayBuffer(file);
    }
});

function displayRaceList(flatTimes, nhTimes) {
    const raceList = document.getElementById('raceList');
    raceList.innerHTML = ''; // Clear previous data

    const combinedTimes = { ...flatTimes, ...nhTimes }; // Merge both objects

    for (const [track, times] of Object.entries(combinedTimes)) {
        const raceItem = document.createElement('div');
        raceItem.className = 'track-item';
        const raceLinks = times.map(time => {
            return `<a href="ratings.html" onclick="loadRatings('${track}', '${time}')">${time}</a>`;
        }).join(', ');
        raceItem.innerHTML = `${track}: ${raceLinks}`;
        raceList.appendChild(raceItem);
    }
}

function loadRatings(track, time) {
    const ratingsBody = document.getElementById('ratingsBody');
    ratingsBody.innerHTML = ''; // Clear previous data

    // Retrieve race data from localStorage
    const raceData = JSON.parse(localStorage.getItem('raceData'));
    if (raceData) {
        raceData.forEach(row => {
            if (row[1] === track && row[0] === time) {
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
}
