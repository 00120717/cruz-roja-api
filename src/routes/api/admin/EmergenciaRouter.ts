import { Router } from "express";
import EmergenciaController from "../../../controllers/EmergenciaController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', EmergenciaController.store);
router.get('/', EmergenciaController.fetch);
router.get('/list', EmergenciaController.list)
router.get('/:id', EmergenciaController.show);
router.put('/:id', EmergenciaController.update);
router.delete('/:id', EmergenciaController.destroy);

export default router;
