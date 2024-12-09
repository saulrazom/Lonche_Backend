import { Router } from 'express';
import likesController from '../controllers/likesController';
import { auth } from '../middlewares';

const likesRoutes = Router();

likesRoutes.post('/like/:id', auth, likesController.likePost);
likesRoutes.post('/unlike/:id', auth, likesController.unlikePost);

export default likesRoutes;
