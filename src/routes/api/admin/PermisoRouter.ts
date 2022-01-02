import { Router } from "express";
import PermissionController from "../../../controllers/PermisoController";

const router: Router = Router();

router.get('/', PermissionController.fetch);
router.get('/list', PermissionController.list);

export default router;
