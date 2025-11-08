import { findRoute } from "../models/roadModel.js";
export const getRoute = async (req, res) => {
    const { x1, y1, x2, y2 } = req.query;
    if (!x1 || !y1 || !x2 || !y2)
        return res.status(400).json({ error: "Missing coordinates" });
    try {
        const route = await findRoute(+x1, +y1, +x2, +y2);
        res.json(route);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Routing failed" });
    }
};
//# sourceMappingURL=RoadController.js.map