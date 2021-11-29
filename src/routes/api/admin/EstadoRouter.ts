import { Router } from "express";
import EstadoController from "../../../controllers/EstadoController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', EstadoController.store);
router.get('/', EstadoController.fetch);
router.get('/list', EstadoController.list)
router.get('/:id', EstadoController.show);
router.put('/:id', EstadoController.update);
router.delete('/:id', EstadoController.destroy);

export default router;
