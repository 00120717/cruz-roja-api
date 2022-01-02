import { Router } from "express";
import PacienteController from "../../../controllers/PacienteController";

const router: Router = Router();

router.get('/', PacienteController.fetch);
router.get('/:id', PacienteController.show);
router.put('/:id', PacienteController.update);
router.delete('/:id', PacienteController.destroy);

export default router;