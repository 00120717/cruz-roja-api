import { Router } from "express";
import TipoVoluntarioController from "../../../controllers/TipoVoluntarioController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', TipoVoluntarioController.store);
router.get('/', TipoVoluntarioController.fetch);
router.get('/list', TipoVoluntarioController.list)
router.get('/:id', TipoVoluntarioController.show);
router.put('/:id', TipoVoluntarioController.update);
router.delete('/:id', TipoVoluntarioController.destroy);

export default router;
