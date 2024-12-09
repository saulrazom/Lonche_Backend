import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { Router } from 'express';

import swaggerConfig from '../../swagger.config';

const swaggerRoutes = Router();

const swaggerDocs = swaggerJSDoc(swaggerConfig);
swaggerRoutes.use('/', serve, setup(swaggerDocs));

export default swaggerRoutes;
