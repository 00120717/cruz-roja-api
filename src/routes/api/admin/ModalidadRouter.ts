import { Router } from "express";
import ModalidadController from "../../../controllers/ModalidadController";

const router: Router = Router();

router.post('/', ModalidadController.store);
router.get('/', ModalidadController.fetch);
router.get('/list', ModalidadController.list)
router.get('/:id', ModalidadController.show);
router.put('/:id', ModalidadController.update);
router.delete('/:id', ModalidadController.destroy);

export default router;
