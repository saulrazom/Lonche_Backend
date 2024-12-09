import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import commentModel from '../models/Comment';
import { Comment } from '../models/Comment';
import ROLES from '../types/roles';

const getComment = (id: string): Promise<Comment | number> => {
  return commentModel
    .findById(id)
    .then((comment) => {
      if (!comment) {
        return HTTP_STATUS_CODES.NOT_FOUND;
      }
      return comment;
    })
    .catch((error) => {
      console.log(error);
      return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    });
};

export const selfComment = (allowedRoles?: ROLES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.myUser;

    getComment(id).then((comment) => {
      if (comment === HTTP_STATUS_CODES.NOT_FOUND) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: 'Item not found' });
      }
      if (comment === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
        return res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
      if ((comment as Comment).id_user.toString() !== user!._id) {
        return res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'You are not allowed to perform this action' });
      }
      if (allowedRoles && !allowedRoles.includes(user!.role!)) {
        return res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'You are not allowed to perform this action' });
      }
      next();
    });
  };
};
