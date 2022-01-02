import { Router } from "express";
import EmergenciaRealizadaController from "../../../controllers/EmergenciaRealizadaController";

const router: Router = Router();

router.post('/', EmergenciaRealizadaController.store);
router.get('/', EmergenciaRealizadaController.fetch);
router.get('/:id', EmergenciaRealizadaController.show);
router.delete('/:id', EmergenciaRealizadaController.destroy);

export default router;