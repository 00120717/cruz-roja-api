import { Router } from "express";
import DepartametoXMunicipioController from "../../../controllers/DepartametoXMunicipioController";

const router: Router = Router();

//TODO: implement role and permission middleware
//router.post('/', DepartametoXMunicipioController.store);
router.get('/', DepartametoXMunicipioController.fetch);
router.get('/list', DepartametoXMunicipioController.list);
router.get('/:id', DepartametoXMunicipioController.show);
//router.put('/:id', DepartametoXMunicipioController.update);
router.delete('/:id', DepartametoXMunicipioController.destroy);

export default router;
