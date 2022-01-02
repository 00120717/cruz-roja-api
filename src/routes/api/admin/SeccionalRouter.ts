import { Router } from "express";
import SeccionalController from "../../../controllers/SeccionalController";

const router: Router = Router();

router.post('/', SeccionalController.store);
router.get('/', SeccionalController.fetch);
router.get('/list', SeccionalController.list)
router.get('/:id', SeccionalController.show);
router.put('/:id', SeccionalController.update);
router.delete('/:id', SeccionalController.destroy);

export default router;
