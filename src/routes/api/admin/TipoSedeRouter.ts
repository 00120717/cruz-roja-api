import { Router } from "express";
import TipoSedeController from "../../../controllers/TipoSedeController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', TipoSedeController.store);
router.get('/', TipoSedeController.fetch);
router.get('/list', TipoSedeController.list)
router.get('/:id', TipoSedeController.show);
router.put('/:id', TipoSedeController.update);
router.delete('/:id', TipoSedeController.destroy);

export default router;
