import { Router } from "express";
import VoluntarioController from "../../../controllers/VoluntarioController";

const router: Router = Router();

router.post('/', VoluntarioController.store);
router.get('/', VoluntarioController.fetch);
router.get('/list', VoluntarioController.list);
router.get('/list-reporte-sede', VoluntarioController.listSede);
router.get('/list-reporte-cuerpo-filial', VoluntarioController.listCuerpoFilial);
router.get('/:id', VoluntarioController.show);
router.put('/:id', VoluntarioController.update);
router.delete('/:id', VoluntarioController.destroy);

export default router;