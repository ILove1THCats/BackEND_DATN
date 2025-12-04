import app from './app.js';
import config from './config/config.js';
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Route proxy
app.get('/proxy', async (req, res) => {
    try {
        //x1: start lon, y2: start lat, x2: end lon, y2: end lat
        let { x1, y1, x2, y2 } = req.query;
        if (!x1 || !y1 || !x2 || !y2) {
            return res.status(400).json({ error: 'Missing coordinates' });
        }
        const geoserverUrl = `http://localhost:8080/geoserver/Roads_guide/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Roads_guide:route&outputFormat=application/json&viewparams=x1:${x1};y1:${y1};x2:${x2};y2:${y2}`;
        const response = await fetch(geoserverUrl);
        const data = await response.json();
        const SPEED_KMH = 40;
        let totalDistance = 0;
        let totalTime = 0;
        if (data.features && Array.isArray(data.features)) {
            data.features = data.features.map((feature) => {
                const coords = feature.geometry?.coordinates;
                if (coords && Array.isArray(coords)) {
                    const distance = calculateDistance({ coordinates: coords });
                    const estimated_time = distance / SPEED_KMH;
                    totalDistance += distance;
                    totalTime += estimated_time;
                    return {
                        ...feature,
                        distance_km: distance,
                        estimated_time_h: estimated_time
                    };
                }
                return feature;
            });
        }
        res.json({
            type: 'FeatureCollection',
            features: data.features || [],
            total_distance_km: totalDistance,
            total_time_h: totalTime
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Proxy fetch error' });
    }
});
app.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on port ${config.port}`);
});
function calculateDistance(line) {
    let distance = 0;
    const coords = line.coordinates;
    for (let i = 0; i < coords.length - 1; i++) {
        const point1 = coords[i];
        const point2 = coords[i + 1];
        // kiểm tra tồn tại
        if (!point1 || !point2)
            continue;
        const [lon1, lat1] = point1;
        const [lon2, lat2] = point2;
        distance += haversine(lat1, lon1, lat2, lon2);
    }
    return distance; // km
}
// Hàm Haversine tính khoảng cách 2 điểm trên Trái đất
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
}
//# sourceMappingURL=server.js.map