import { Router } from "express";
import HospitalController from "../../../controllers/HospitalController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', HospitalController.store);
router.get('/', HospitalController.fetch);
router.get('/list', HospitalController.list)
router.get('/:id', HospitalController.show);
router.put('/:id', HospitalController.update);
router.delete('/:id', HospitalController.destroy);

export default router;
