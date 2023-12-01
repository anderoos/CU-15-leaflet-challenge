// ====================================== //
// ------- FUNCTIONS DO NOT DELETE -------//
// ====================================== //

// Normalize magnitude by max/min values
function normalizeData(feature, min, max) {
    let normalized;
    normalized = (feature - min) / (max - min);
    return normalized;
}


// Scale markersize to normalized magnitude
function markerSize(magnitude) {
    let magNormalized = 0
    let modifier = 100000
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
        let rChannel = (225 * depthNormalized);
        let gChannel = 255 - (255 * depthNormalized);
        let bChannel = 0;
        color = `rgb(${rChannel}, ${gChannel}, ${bChannel})`
    }
    return color
}

// Source:
// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function convertUNIXTime(timestring){
    var a = new Date(timestring * 1000)
    var time = a ;
    return time;
}
