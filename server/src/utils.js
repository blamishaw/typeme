// Utils functions


// Function to get Haversine distance between two pairs of coordinates in miles
function getHaversineDistance(loc1, loc2) {
    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    // Return "Unknown" distance if any of the coordinates are null
    if (!loc1?.latitude || !loc1?.longitude || !loc2?.latitude || !loc2?.longitude) {
        return "unknown";
    }

    let { latitude: lat1, longitude: lon1 } = loc1;
    let { latitude: lat2, longitude: lon2 } = loc2;

    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Haversine Formula
    const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

    return Math.round(finalDistance /= 1.60934, 3);
}

module.exports = { getHaversineDistance };