import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import ROLES from '../types/roles';

export const permissions = (allowedRoles: ROLES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.myUser;
    if (!user) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
      return;
    }
    if (allowedRoles.includes(user.role!)) {
      next();
    } else {
      res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: 'Forbidden' });
    }
  };
};
