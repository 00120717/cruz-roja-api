import { Router } from "express";
import ModalidadController from "../../../controllers/ModalidadController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', ModalidadController.store);
router.get('/', ModalidadController.fetch);
router.get('/list', ModalidadController.list)
router.get('/:id', ModalidadController.show);
router.put('/:id', ModalidadController.update);
router.delete('/:id', ModalidadController.destroy);

export default router;
