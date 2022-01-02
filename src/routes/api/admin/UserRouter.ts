import { Router } from 'express';
import UserController from '../../../controllers/UsuarioController';

const router: Router = Router();

router.post('/', UserController.store);
router.get('/', UserController.fetch);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
