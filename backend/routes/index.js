import { Router } from 'express';
import resourcesRoutes from './resources.routes.js';
import statisticsRoutes from './statistics.routes.js';
import { CATEGORIAS, IDIOMAS, TIPOS } from '../utils/catalogs.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/options', (req, res) => res.json({ tipos: TIPOS, categorias: CATEGORIAS, idiomas: IDIOMAS }));

router.use('/resources', resourcesRoutes);
router.use('/statistics', statisticsRoutes);

export default router;
