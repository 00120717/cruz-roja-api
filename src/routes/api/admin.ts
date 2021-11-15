import { Router } from 'express';
import AuthRouter from './admin/AuthRouter';
import UserRouter from './admin/UserRouter';
import SedeRouter from './admin/SedeRouter';
import RoleRouter from './admin/RoleRouter';
import PermissionsRouter from './admin/PermissionsRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/sede', SedeRouter);
router.use('/roles', RoleRouter);
router.use('/permissions', PermissionsRouter);

export default router;
