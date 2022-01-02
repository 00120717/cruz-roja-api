import { Router } from "express";
import RolController from "../../../controllers/RolController";

const router: Router = Router();

router.post('/', RolController.store);
router.get('/', RolController.fetch);
router.get('/list', RolController.list);
router.get('/:id', RolController.show);
router.put('/:id', RolController.update);
router.delete('/:id', RolController.destroy);

export default router;
