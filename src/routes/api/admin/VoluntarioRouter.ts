import { Router } from "express";
import VoluntarioController from "../../../controllers/VoluntarioController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', VoluntarioController.store);
router.get('/', VoluntarioController.fetch);
router.get('/:id', VoluntarioController.show);
router.put('/:id', VoluntarioController.update);
router.delete('/:id', VoluntarioController.destroy);/*
router.get('/:id/notes', VoluntarioController.fetchNotes);
router.post('/:id/notes', VoluntarioController.saveNotes);
router.post('/:id/institutional-average', VoluntarioController.publishInstitutionalAverage);
router.post('/:id/final-average', VoluntarioController.publishFinalAverage);
router.post('/:id/add-subject', VoluntarioController.assignNewSubject);
router.get('/:id/subjects', VoluntarioController.subjects);*/

export default router;