import { Router } from "express";
import PermisoController from "../../../controllers/PermisoController";

const router: Router = Router();

router.get('/', PermisoController.fetch);
router.get('/list', PermisoController.list);

export default router;
