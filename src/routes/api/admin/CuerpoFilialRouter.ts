import { Router } from "express";
import CuerpoFilialController from "../../../controllers/CuerpoFilialController";

const router: Router = Router();

router.post('/', CuerpoFilialController.store);
router.get('/', CuerpoFilialController.fetch);
router.get('/list', CuerpoFilialController.list)
router.get('/:id', CuerpoFilialController.show);
router.put('/:id', CuerpoFilialController.update);
router.delete('/:id', CuerpoFilialController.destroy);

export default router;
