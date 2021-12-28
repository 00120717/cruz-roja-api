import { Router } from "express";
import VehiculoController from "../../../controllers/VehiculoController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', VehiculoController.store);
router.get('/', VehiculoController.fetch);
router.get('/list', VehiculoController.list)
router.get('/:id', VehiculoController.show);
router.put('/:id', VehiculoController.update);
router.delete('/:id', VehiculoController.destroy);

export default router;
