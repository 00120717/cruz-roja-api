import { Router } from "express";
import VoluntarioController from "../../../controllers/VoluntarioController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', VoluntarioController.store);
router.get('/', VoluntarioController.fetch);
router.get('/:id', VoluntarioController.show);
router.put('/:id', VoluntarioController.update);
router.delete('/:id', VoluntarioController.destroy);

export default router;