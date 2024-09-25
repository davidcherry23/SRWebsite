document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    
    // Log the available DOM elements for debugging
    console.log("Available DOM elements:", document.body.innerHTML);

    const uploadForm = document.getElementById('uploadForm');
    if (!uploadForm) {
        console.error("Upload form not found!");
        return;
    }

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                console.log("File read successfully");
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
                } else {
                    console.error("FLAT sheet not found!");
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
                } else {
                    console.error("NH sheet not found!");
                }

                // Store ratings data in localStorage for later use
                localStorage.setItem('raceData', JSON.stringify(ratingsData));
                console.log("Race data stored in localStorage");

                displayRaceList(flatTimes, nhTimes);
            };

            reader.readAsArrayBuffer(file);
        } else {
            console.error("No file selected");
        }
    });
});

function displayRaceList(flatTimes, nhTimes) {
    const raceList = document.getElementById('raceList');
    raceList.innerHTML = ''; // Clear previous data

    const combinedTimes = { ...flatTimes, ...nhTimes }; // Merge both objects
    console.log("Combined race times:", combinedTimes);

    for (const [track, times] of Object.entries(combinedTimes)) {
        const raceItem = document.createElement('div');
        raceItem.className = 'track-item';
        const raceLinks = times.map(time => {
            return `<a href="ratings.html?track=${encodeURIComponent(track)}&time=${encodeURIComponent(time)}">${time}</a>`;
        }).join(', ');
        raceItem.innerHTML = `${track}: ${raceLinks}`;
        raceList.appendChild(raceItem);
    }
}
