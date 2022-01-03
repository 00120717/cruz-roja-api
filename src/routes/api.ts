//import { checkStudentJWT } from '../middlewares/checkStudentJWT';
import { Router } from 'express';
import AdminRouter from './api/admin';
import AuthRouter from './api/AuthRouter';
import SedeController from "../controllers/SedeController";

const router: Router = Router();

router.use('/admin', AdminRouter);
router.use('/auth', AuthRouter);
router.get('/sede-informacion', SedeController.sedeInformation);

export default router;
