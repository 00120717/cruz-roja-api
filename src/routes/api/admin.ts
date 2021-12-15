import { Router } from 'express';
import AuthRouter from './admin/AuthRouter';
import UserRouter from './admin/UserRouter';
import SedeRouter from './admin/SedeRouter';
import RoleRouter from './admin/RoleRouter';
import PermissionsRouter from './admin/PermissionsRouter';
import VoluntarioRouter from './admin/VoluntarioRouter';
import CuerpoFilialRouter from './admin/CuerpoFilialRouter';
import EstadoRouter from './admin/EstadoRouter';
import DepartamentoXMunicipioRouter from './admin/DepartamentoXMunicipioRouter';
import ModalidadRouter from './admin/ModalidadRouter';
import TipoVoluntarioRouter from './admin/TipoVoluntarioRouter';
import TipoSedeRouter from './admin/TipoSedeRouter';
import { checkJWT } from '../../middlewares/checkJWT';
import { checkRole } from '../../middlewares/checkRole';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', [checkJWT, checkRole], UserRouter);
router.use('/sede', /*[checkJWT, checkRole],*/ SedeRouter);
router.use('/roles', [checkJWT, checkRole], RoleRouter);
router.use('/permissions', [checkJWT, checkRole], PermissionsRouter);
router.use('/voluntario', /*[checkJWT, checkRole],*/ VoluntarioRouter);
router.use('/cuerpoFilial', [checkJWT, checkRole], CuerpoFilialRouter);
router.use('/estado', [checkJWT, checkRole], EstadoRouter);
router.use('/modalidad', [checkJWT, checkRole], ModalidadRouter);
router.use('/departamentoXMunicipio',/* [checkJWT, checkRole],*/ DepartamentoXMunicipioRouter);
router.use('/tipoSede', [checkJWT, checkRole], TipoSedeRouter);
router.use('/tipoVoluntario', [checkJWT, checkRole], TipoVoluntarioRouter);

export default router;
