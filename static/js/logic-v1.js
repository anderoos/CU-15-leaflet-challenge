// url declaration
// All 2.5+ earthquakes in the last 30 days
let earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
let boundaryurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// Add tile layer to mainMap
    // Default Map
let defaultMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
    // Topographic map
let topoMapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Generate mainMap
let mainMap = L.map('map', {
    center: [28.04, 1.66],
    zoom: 3,
    layers: [defaultMapLayer]
});

// Control panel
let mapFilters = {
    "Default": defaultMapLayer,
    "Topographic": topoMapLayer
}

// let mapToggles = {
//     "Tectonic Boundaries": boundaryLayer
// }
// let overlayMaps = {}
L.control.layers(mapFilters).addTo(mainMap);
// L.control.layers([mapFilters, mapToggles], {}).addTo(mainMap);

// Scope out data to get min/max values
// Probably better way to do this instead of iterating through data
let magMax = 0;
let magMin = 10;
let depthMax = 0;
let depthMin = 500;

// Parse earthquake/ boundary data
d3.json(earthquakeurl).then(function(payload){
    d3.json(boundaryurl).then(function(boundary_payload) {
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
        console.log(magMax, magMin, depthMax, depthMin) // Check values

        // Iterate through features
        for (let event of payload.features) {
            let eventURL = event['properties'].url      // Capture URL
            let eventTimeUNIX = event['properties'].time
            // Add circle marker
            L.circle([event['geometry'].coordinates[1], event['geometry'].coordinates[0]], {
                fillOpacity: 0.6,
                color: "white",
                weight: 0.6,
                fillColor: markerColor(event['geometry'].coordinates[2]),
                radius: markerSize(event['properties'].mag)
            }).bindPopup(`<h2><a href=${eventURL}>${event['properties'].place}</h2></a>
                <small>Time: ${convertUNIXTime(eventTimeUNIX)}</small><br>
                <small><a href=${eventURL}>More Info</a></small><hr>
                <p>EarthquakeID: ${event.id}</p>
                <p>Magnitude: ${event['properties'].mag}</p>
                <p>Depth: ${event['geometry'].coordinates[2]} km</p>
                `).addTo(mainMap)
        }

        let boundaryLayer = L.geoJSON(boundary_payload, {
            style: {
                color: "orange",
                weight: 2,
                opacity: 0.9
            }
        }).addTo(mainMap);

        L.control.Legend({
            position: "topright",
            title: "Depth Color Map",
            symbolWidth: 80,
            symbolHeight: 225,
            legends: [{
                type: "image",
                url: "Images/green-red-cmap-mod.png",
                label: ''
            }]
        }).addTo(mainMap)
    });
});