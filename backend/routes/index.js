import { Router } from 'express';
import contactRoutes from './contact.routes.js';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import blogRoutes from './blog.routes.js';
import heroRoutes from './hero.routes.js';
import aboutRoutes from './about.routes.js';
import serviceRoutes from './service.routes.js';
import showcaseRoutes from './showcase.routes.js';

const apiRouter = Router();

// Version 1 API routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/health', healthRoutes);
apiRouter.use('/blogs', blogRoutes);
apiRouter.use('/hero', heroRoutes);
apiRouter.use('/about', aboutRoutes);
apiRouter.use('/services', serviceRoutes);
apiRouter.use('/showcase', showcaseRoutes);

export default apiRouter;
