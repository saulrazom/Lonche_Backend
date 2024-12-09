import categoryModel from '../models/Categories';
import BaseController from '../utils/BaseController';

import { Category } from '../models/Categories';
import { Model } from 'mongoose';

import HTTP_STATUS_CODES from '../types/http-status-codes';
import { Request, Response } from 'express';

class CategoriesController extends BaseController<Category> {
  constructor(model: Model<Category>) {
    super(model);
  }

  getByName = (req: Request, res: Response) => {
    const { name } = req.params;

    this.model
      .findOne({ name })
      .then((item: Category | null) => {
        if (!item) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .send({ message: 'Item not found' });
        }

        return res.status(HTTP_STATUS_CODES.OK).json(item);
      })
      .catch((error: any) =>
        this.handleError(res, error, 'Error fetching item')
      );
  };

  getCategoriesByNames = async (req: Request, res: Response) => {
    try {
      const { names } = req.query;

      if (!names || !Array.isArray(names)) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Names must be an array of category names' });
        return;
      }

      const categories = await this.model.find({
        name: { $in: names },
      });

      res.status(HTTP_STATUS_CODES.OK).json(categories);
      return;
    } catch (error) {
      this.handleError(res, error, 'Error fetching categories');
    }
  };
}

export default new CategoriesController(categoryModel);
