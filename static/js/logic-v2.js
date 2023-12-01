// url declaration
// All 2.5+ earthquakes in the last 7 days
// Global vars
let earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
let boundaryurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Scope out data to get min/max values
// Probably better way to do this instead of iterating through data
let magMax = 0;
let magMin = 10;
let depthMax = 0;
let depthMin = 500;

// Parse data for min/max values
d3.json(earthquakeurl).then(function(payload) {
    // Scope out data to get min/max values
    // Probably better way to do this instead of iterating through data
    for (let magEvent of payload.features) {
        if (magEvent['properties'].mag > magMax) {
            magMax = magEvent['properties'].mag;
        }
        if (magEvent['properties'].mag < magMin) {
            magMin = magEvent['properties'].mag;
        }
        if (magEvent['geometry'].coordinates[2] > depthMax) {
            depthMax = magEvent['geometry'].coordinates[2];
        }
        if (magEvent['geometry'].coordinates[2] < depthMin) {
            depthMin = magEvent['geometry'].coordinates[2];
        }
    }
    console.log(magMax, magMin, depthMax, depthMin) // Check values
});

// Data promise for earthquake data, build circle markers
d3.json(earthquakeurl).then(function(data){
    console.log(data)
    buildCircleMarkers(data.features)
});

// Create Map layer
function buildMap(data){
    // Define map tiles
    // Default Map
    let defaultMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    // Topographic map
    let topoMapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // Build tectonic layer
    let boundaryLayer = L.layerGroup();
    d3.json(boundaryurl).then(function(boundaryData) {
      buildBoundaryMarker(boundaryData).addTo(boundaryLayer)
    });

    // Map groups
    let mapFilters = {
        "Default": defaultMapLayer,
        "Topographic": topoMapLayer
    };
    let mapToggles = {
        "Tectonic Boundaries": boundaryLayer,
        "Earthquake Events": data
    };

    // Build map
    let mainMap = L.map('map', {
        center: [28.04, 1.66],
        zoom: 3,
        layers: [defaultMapLayer]
    });

    // Control layers
    L.control.layers(mapFilters, mapToggles, {
        collapsed: false
    }).addTo(mainMap);

    // Map legend
    L.control.Legend({
        position: "topright",
        title: "Depth Color Map",
        symbolWidth: 225,
        symbolHeight: 200,
        legends: [{
            type: "image",
            url: "Images/green-red-cmap-mod.png",
            label: ''
        }]
    }).addTo(mainMap)
};

// Build circle markers using geoJSON
function buildCircleMarkers(response){
    // Define onEachFeature
    function onEachFeature(feature, layer) {
        let eventURL = feature.properties.url
        let eventTimeUNIX = feature.properties.time
        layer.bindPopup(`<h2><a href=${eventURL}>${feature['properties'].place}</h2></a>
                <small>Time: ${convertUNIXTime(eventTimeUNIX)}</small><br>
                <small><a href=${eventURL}>More Info</a></small><hr>
                <p>EarthquakeID: ${feature.id}</p>
                <p>Magnitude: ${feature['properties'].mag}</p>
                <p>Depth: ${feature['geometry'].coordinates[2]} km</p>
                `)
    }

    // geoJSON to parse features
    let allEvents = L.geoJSON(response, {
        onEachFeature: onEachFeature,
        pointToLayer: function(featurePoint, coords) {
            // Build circle markers
            let circleMarker = L.circle(coords, {
                fillOpacity: 0.6,
                color: "white",
                weight: 0.6,
                fillColor: markerColor(featurePoint['geometry'].coordinates[2]),
                radius: markerSize(featurePoint['properties'].mag)
            });
            return circleMarker
        }
    });
    buildMap(allEvents);
}

// Build boundary layers
function buildBoundaryMarker(response){
    let boundaryLayer = L.geoJSON(response, {
        style: {
            color: "orange",
            weight: 2,
            opacity: 0.9
        }
    })
    return boundaryLayer
}

