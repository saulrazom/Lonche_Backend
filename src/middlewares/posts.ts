import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import postModel from '../models/Post';
import { Post } from '../models/Post';
import ROLES from '../types/roles';

const getPost = (id: string): Promise<Post | number> => {
  return postModel
    .findById(id)
    .then((post) => {
      if (!post) {
        return HTTP_STATUS_CODES.NOT_FOUND;
      }
      return post;
    })
    .catch((error) => {
      console.log(error);
      return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    });
};

export const selfPost = (allowedRoles?: ROLES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.myUser;

    getPost(id).then((post) => {
      if (post === HTTP_STATUS_CODES.NOT_FOUND) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: 'Item not found' });
      }
      if (post === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
        return res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
      if ((post as Post).id_user.toString() !== user!._id) {
        return res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'You are not allowed to perform this action' });
      }
      if (allowedRoles && !allowedRoles.includes(user!.role!)) {
        console.log('not allowed role');
        return res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .json({ message: 'You are not allowed to perform this action' });
      }
      next();
    });
  };
};
