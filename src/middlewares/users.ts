import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import ROLES from '../types/roles';

export const selfUser = (allowedRoles?: ROLES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.myUser;
    const { id } = req.params;

    if (allowedRoles && !allowedRoles.includes(user!.role!)) {
      res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ message: 'You are not allowed to perform this action' });
    } else if ((user!._id as string) !== id) {
      res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: 'Forbidden' });
    } else {
      next();
    }
  };
};
