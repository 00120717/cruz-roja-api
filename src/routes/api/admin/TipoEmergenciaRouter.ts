import { Router } from "express";
import TipoEmergenciaController from "../../../controllers/TipoEmergenciaController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', TipoEmergenciaController.store);
router.get('/', TipoEmergenciaController.fetch);
router.get('/list', TipoEmergenciaController.list)
router.get('/:id', TipoEmergenciaController.show);
router.put('/:id', TipoEmergenciaController.update);
router.delete('/:id', TipoEmergenciaController.destroy);

export default router;
