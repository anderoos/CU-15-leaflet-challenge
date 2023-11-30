// url declaration
// All 2.5+ earthquakes in the last 7 days
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
    zoom: 2.4,
    layers: [defaultMapLayer]
});

// Control panel
let mapFilters = {
    "Default": defaultMapLayer,
    "Topographic": topoMapLayer
}

// IGNORE
// d3.json(earthquakeurl).then(function(payload) {
//     let eventURL = feature['properties'].url
//     // Build circles
//     circleLayer = L.circle([payload['geometry'].coordinates[1], payload['geometry'].coordinates[0]], {
//         fillOpacity: 0.6,
//         color: "white",
//         weight: 0.6,
//         fillColor: markerColor(payload['geometry'].coordinates[2]),
//         radius: markerSize(payload['properties'].mag)
//     },
//         onEachFeature: function (feature, layer){
//             layer.bindPopup(`<h2><a href=${eventURL}>${feature['properties'].place}</h2></a>
//             <small><a href=${eventURL}>More Info</a></small><hr>
//             <p>EarthquakeID: ${feature.id}</p>
//             <p>Magnitude: ${feature['properties'].mag}</p>
//             <p>Depth: ${feature['geometry'].coordinates[2]}</p>`)
//         }
//     }).addTo(mainMap)
//
//     // Build legend
//     let legend = L.control({ position: 'bottomright' })
//     legend.onAdd = function(mainMap) {
//         let div = L.DomUtil.create('div', 'info legend')
//         let limits = circleLayer.options.limits
//         let colors = circleLayer.options.colors
//         let labels = []

