import { Router } from 'express';
import AuthRouter from './admin/AuthRouter';
import UserRouter from './admin/UserRouter';
import SedeRouter from './admin/SedeRouter';
import RoleRouter from './admin/RoleRouter';
import PermissionsRouter from './admin/PermissionsRouter';
import VoluntarioRouter from './admin/VoluntarioRouter';
import CuerpoFilialRouter from './admin/CuerpoFilialRouter';
import EstadoRouter from './admin/EstadoRouter';
import ModalidadRouter from './admin/ModalidadRouter';
import TipoVoluntarioRouter from './admin/TipoVoluntarioRouter';
import { checkJWT } from '../../middlewares/checkJWT';
import { checkRole } from '../../middlewares/checkRole';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users',[checkJWT, checkRole], UserRouter);
router.use('/sede', SedeRouter);
router.use('/roles', RoleRouter);
router.use('/permissions', PermissionsRouter);
router.use('/voluntario', VoluntarioRouter);
router.use('/cuerpoFilial', CuerpoFilialRouter);
router.use('/estado', EstadoRouter);
router.use('/modalidad', ModalidadRouter);
router.use('/tipoVoluntario', TipoVoluntarioRouter);

export default router;
