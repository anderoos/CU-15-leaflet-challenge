// url declaration
// All 1+ earthquakes in the last 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
let mainMap = L.map('map').setView([28.04, 1.66], 2.4)

// Add tile layer to mainMap
// Basic Map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mainMap);


// Scope out data to get min/max values
// Probably better way to do this instead of iterating through data
let magMax = 0;
let magMin = 10;
let depthMax = 0;
let depthMin = 500;

// Parse data
d3.json(url).then(function(payload){
    // Scope out data to get min/max values
    // Probably better way to do this instead of iterating through data
    for (let magEvent of payload.features) {
        if (magEvent['properties'].mag > magMax) {
            magMax = magEvent['properties'].mag;
        }
        if (magEvent['properties'].mag < magMin){
            magMin = magEvent['properties'].mag;
        }
        if (magEvent['geometry'].coordinates[2]> depthMax) {
            depthMax = magEvent['geometry'].coordinates[2];
        }
        if (magEvent['geometry'].coordinates[2] < depthMin){
            depthMin = magEvent['geometry'].coordinates[2];
        }
    }
    // console.log(magMax, magMin, depthMax, depthMin) // Check values

    // Iterate through features
    for (let event of payload.features) {
        let eventURL = event['properties'].url      // Capture URL
        // Add circle marker
        L.circle([event['geometry'].coordinates[1], event['geometry'].coordinates[0]], {
            fillOpacity: 0.6,
            color: "white",
            weight: 0.6,
            fillColor: markerColor(event['geometry'].coordinates[2]),
            radius: markerSize(event['properties'].mag)
        })
            // Bind popup message
        .bindPopup(`<h2><a href=${eventURL}>${event['properties'].place}</h2></a>
            <small><a href=${eventURL}>More Info</a></small><hr>
            <p>EarthquakeID: ${event.id}</p>
            <p>Magnitude: ${event['properties'].mag}</p>
            <p>Depth: ${event['geometry'].coordinates[2]}</p>
            `).addTo(mainMap);
    }
});

// Normalize magnitude by max/min values
function normalizeData(feature, min, max) {
    let normalized;
    normalized = (feature - min) / (max - min);
    return normalized;
}
// Scale markersize to normalized magnitude
function markerSize(magnitude) {
    let magNormalized = 0
    let modifier = Math.exp(13)
    if (magnitude){
        magNormalized = normalizeData(magnitude, magMin, magMax)
    }
    return magNormalized * modifier
}
// Scale markercolor to normalized depth
function markerColor(depth) {
    // Default to grey if no depth data available
    let color = "#656565";
    if (depth) {
        let depthNormalized = normalizeData(depth, depthMin, depthMax)
        let rChannel = 255 * (0.5 + depthNormalized);
        let gChannel = 255 - (255 * depthNormalized);
        let bChannel = 0;
        color = `rgb(${rChannel}, ${gChannel}, ${bChannel})`
    }
    return color
}