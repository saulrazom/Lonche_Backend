import { Request, Response } from 'express';
import BaseController from '../utils/BaseController';
import { Post } from '../models/Post';
import { Model } from 'mongoose';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import postModel from '../models/Post';
import categoriesModel from '../models/Categories';

class PostsController extends BaseController<Post> {
  constructor(model: Model<Post>) {
    super(model);
  }

  create = async (req: Request, res: Response) => {
    const content = req.body;
    content.id_user = req.myUser!._id;
    content.username = req.myUser!.username;

    if (req.file) {
      content.mediaURL = (req.file as Express.MulterS3.File).location;
    }

    try {
      if (
        !Array.isArray(content.categories) ||
        content.categories.length === 0
      ) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Categories are required and must be an array' });
        return;
      }

      const categories = await categoriesModel.find({
        name: { $in: content.categories },
      });

      if (categories.length !== content.categories.length) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Some categories are invalid or do not exist' });
        return;
      }

      const post = await this.model.create(content);
      res.status(HTTP_STATUS_CODES.CREATED).json(post);
    } catch (error) {
      this.handleError(res, error, 'Error creating item');
    }
  };

  getAll = (req: Request, res: Response) => {
    const exclude = req.query.exclude === 'true';
    const popular = req.query.popular === 'true';
    const tag = req.query.tag as string | undefined;
    const id_city = req.query.city as string | undefined;

    const query: any = exclude ? { id_user: { $ne: req.myUser!._id } } : {};

    if (tag) {
      query.categories = { $in: [tag] };
    }

    if (id_city) {
      query.id_city = id_city;
    }

    const sortCriteria: { [key: string]: 1 | -1 } = popular
      ? { likes: -1 }
      : { creationDate: -1 };

    this.model
      .find(query)
      .populate({
        path: 'id_city',
      })
      .sort(sortCriteria)
      .then((items: Post[]) => {
        res.status(HTTP_STATUS_CODES.OK).json(items);
      })

      .catch((error: any) =>
        this.handleError(res, error, 'Error fetching items')
      );
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const content = req.body;

    if (req.file) {
      content.mediaURL = (req.file as Express.MulterS3.File).location;
    }

    this.model
      .findByIdAndUpdate(id, content, { new: true, runValidators: true })
      .then((item: Post | null) => {
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

export default new PostsController(postModel);
