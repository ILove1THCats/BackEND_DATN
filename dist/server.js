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
        const { x1, y1, x2, y2 } = req.query;
        if (!x1 || !y1 || !x2 || !y2) {
            return res.status(400).json({ error: 'Missing coordinates' });
        }
        const geoserverUrl = `http://localhost:8080/geoserver/Roads_guide/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Roads_guide:route&outputFormat=application/json&viewparams=x1:${x1};y1:${y1};x2:${x2};y2:${y2}`;
        const response = await fetch(geoserverUrl);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Proxy fetch error' });
    }
});
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
//# sourceMappingURL=server.js.map