document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const sheets = content.split(/(?=FLAT)|(?=NH)/); // Split content by sheets

            const flatTimes = {};
            const nhTimes = {};
            const ratingsData = []; // To store all ratings data

            sheets.forEach(sheet => {
                const lines = sheet.split('\n').map(line => line.split(','));

                // Extract data from FLAT sheet
                if (lines[0][0] === 'Time' && lines[0][1] === 'Track') {
                    lines.slice(1).forEach(row => {
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

                // Extract data from NH sheet
                else if (lines[0][0] === 'Time' && lines[0][1] === 'Track') {
                    lines.slice(1).forEach(row => {
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
            });

            // Store ratings data in localStorage for later use
            localStorage.setItem('raceData', JSON.stringify(ratingsData));

            displayRaceList(flatTimes, nhTimes);
        };

        reader.readAsText(file);
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
