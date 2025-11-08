import express from 'express';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import roadRoutes from './routes/roadRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
const app = express();
app.use(express.json());
// Routes
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/places', placeRoutes);
app.use("/api/roads", roadRoutes);
// Global error handler (should be after routes)
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map