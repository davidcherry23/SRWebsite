document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const lines = content.split('\n');
            const raceData = lines.map(line => line.split(','));

            // Store race data in localStorage for access on ratings.html
            localStorage.setItem('raceData', JSON.stringify(raceData));
            displayRaceList(raceData);
        };

        reader.readAsText(file);
    }
});

function displayRaceList(raceData) {
    const raceList = document.getElementById('raceList');
    raceList.innerHTML = ''; // Clear previous data

    const raceTimes = {};
    raceData.forEach(row => {
        if (row.length > 0 && row[0] && row[1]) {
            const [time, track] = [row[0], row[1]];
            if (!raceTimes[time]) {
                raceTimes[time] = [];
            }
            raceTimes[time].push(track);
        }
    });

    for (const [time, tracks] of Object.entries(raceTimes)) {
        const trackList = tracks.join(', ');
        const raceItem = document.createElement('div');
        raceItem.innerHTML = `<a href="ratings.html" onclick="loadRatings('${time}')">${trackList} at ${time}</a>`;
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
