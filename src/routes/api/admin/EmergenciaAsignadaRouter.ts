import { Router } from "express";
import EmergenciaAsignadaController from "../../../controllers/EmergenciaAsignadaController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', EmergenciaAsignadaController.store);
router.get('/', EmergenciaAsignadaController.fetch);
router.get('/:id', EmergenciaAsignadaController.show);
router.delete('/:id', EmergenciaAsignadaController.destroy);

export default router;