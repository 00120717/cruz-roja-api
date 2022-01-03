import { Router } from "express";
import EmergenciaRealizadaController from "../../../controllers/EmergenciaRealizadaController";

const router: Router = Router();

router.post('/', EmergenciaRealizadaController.store);
router.get('/', EmergenciaRealizadaController.fetch);
router.get('/list-reporte/', EmergenciaRealizadaController.listAll);
router.get('/list-reporte-fecha-ubicacion/:id/:fechaInicio/:fechaFin', EmergenciaRealizadaController.listFechaUbicacion);
router.get('/list-reporte-fecha-tipo/:id/:fechaInicio/:fechaFin', EmergenciaRealizadaController.listFechaTipo);
router.get('/:id', EmergenciaRealizadaController.show);
router.delete('/:id', EmergenciaRealizadaController.destroy);

export default router;