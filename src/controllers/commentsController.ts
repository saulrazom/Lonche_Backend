import commentModel from '../models/Comment';
import postModel from '../models/Post';
import BaseController from '../utils/BaseController';
import { Comment } from '../models/Comment';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';

class CommentsController extends BaseController<Comment> {
  constructor(model: Model<Comment>) {
    super(model);
  }

  create = async (req: Request, res: Response) => {
    const content = req.body;

    try {
      const comment = await this.model.create(content);
      await postModel.findByIdAndUpdate(content.id_post, {
        $inc: { numComments: 1 },
      });
      res.status(HTTP_STATUS_CODES.CREATED).json(comment);
    } catch (error) {
      this.handleError(res, error, 'Error creating comment');
    }
  };

  getAll = (req: Request, res: Response) => {
    const id_post = req.query.id;
    console.log(id_post);

    this.model
      .find({ id_post })
      .then((items: Comment[]) => res.status(HTTP_STATUS_CODES.OK).json(items))
      .catch((error: any) =>
        this.handleError(res, error, 'Error fetching items')
      );
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const content = req.body;

    content.id_user = req.myUser!._id;

    this.model
      .findByIdAndUpdate(id, content, { new: true, runValidators: true })
      .then((item: Comment | null) => {
        if (!item) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'Item not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(item);
      })
      .catch((error: any) =>
        this.handleError(res, error, 'Error updating item')
      );
  };
}

export default new CommentsController(commentModel);
