import { Router } from "express";
import DepartametoXMunicipioController from "../../../controllers/DepartametoXMunicipioController";

const router: Router = Router();

router.get('/', DepartametoXMunicipioController.fetch);
router.get('/list', DepartametoXMunicipioController.list);
router.get('/:id', DepartametoXMunicipioController.show);
router.delete('/:id', DepartametoXMunicipioController.destroy);

export default router;
