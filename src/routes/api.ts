//import { checkStudentJWT } from '../middlewares/checkStudentJWT';
import { Router } from 'express';
import AdminRouter from './api/admin';
import AuthRouter from './api/AuthRouter';
import SedeController from "../controllers/SedeController";

const router: Router = Router();

router.use('/admin', AdminRouter);
router.use('/auth', AuthRouter);
//router.get('/student/notes', [checkStudentJWT, checkStudentCode], StudentController.showByCode);
//router.get('/student/me', [checkStudentJWT, checkStudentCode], StudentController.me);
//router.post('/student/contact', [checkStudentJWT, checkStudentCode], StudentController.updateContact);
router.get('/sede-information', SedeController.sedeInformation);
//router.get('/modules', ModuleController.list);
//router.post('/enrollment', StudentController.studentInformation);a

export default router;
