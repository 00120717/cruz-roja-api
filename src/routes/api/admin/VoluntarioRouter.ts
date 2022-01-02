import { Router } from "express";
import VoluntarioController from "../../../controllers/VoluntarioController";

const router: Router = Router();

router.post('/', VoluntarioController.store);
router.get('/', VoluntarioController.fetch);
router.get('/list', VoluntarioController.list);
router.get('/:id', VoluntarioController.show);
router.put('/:id', VoluntarioController.update);
router.delete('/:id', VoluntarioController.destroy);

export default router;