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

            sheets.forEach(sheet => {
                const lines = sheet.split('\n').map(line => line.split(','));

                if (lines[0][0] === 'Time' && lines[0][1] === 'Track') {
                    // Extract data from FLAT sheet
                    lines.slice(1).forEach(row => {
                        if (row.length > 1) {
                            const [time, track] = [row[0], row[1]];
                            if (!flatTimes[track]) {
                                flatTimes[track] = [];
                            }
                            flatTimes[track].push(time);
                        }
                    });
                } else if (lines[0][0] === 'Time' && lines[0][1] === 'Track') {
                    // Extract data from NH sheet
                    lines.slice(1).forEach(row => {
                        if (row.length > 1) {
                            const [time, track] = [row[0], row[1]];
                            if (!nhTimes[track]) {
                                nhTimes[track] = [];
                            }
                            nhTimes[track].push(time);
                        }
                    });
                }
            });

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
        raceItem.innerHTML = `${track}: ${times.join(', ')}`;
        raceList.appendChild(raceItem);
    }
}

function loadRatings() {
    const ratingsBody = document.getElementById('ratingsBody');
    ratingsBody.innerHTML = ''; // Clear previous data

    // Retrieve race data from localStorage
    const raceData = JSON.parse(localStorage.getItem('raceData'));
    if (raceData) {
        raceData.forEach(row => {
            const newRow = document.createElement('tr');
            row.forEach((cell, index) => {
                const newCell = document.createElement('td');
                newCell.textContent = cell;
                newRow.appendChild(newCell);
            });
            ratingsBody.appendChild(newRow);
        });
    }
}
