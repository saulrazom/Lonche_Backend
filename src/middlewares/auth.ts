// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import MyUser from '../types/User';

// declare global {
//   namespace Express {
//     interface Request {
//       myUser?: MyUser;
//     }
//   }
// }

// export const auth = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.headers['auth'] as string;

//   if (!token) {
//     res.status(401).json({ message: 'Unauthorized: Token missing' });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as MyUser;
//     req.myUser = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import MyUser from '../types/User';

declare global {
  namespace Express {
    interface Request {
      myUser?: MyUser;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: Token missing' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Obtiene el token después de "Bearer"

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as MyUser;
    req.myUser = decoded; // Almacena el usuario decodificado en `req.myUser`
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};