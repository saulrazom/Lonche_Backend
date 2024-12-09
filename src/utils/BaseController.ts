import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import { Model } from 'mongoose';

interface BaseDocument {
  _id: unknown;
}

class BaseController<T extends BaseDocument> {
  constructor(public model: Model<T>) {}

  create = (req: Request, res: Response) => {
    const content = req.body;

    this.model
      .create(content)
      .then((item: T) => res.status(HTTP_STATUS_CODES.CREATED).json(item))
      .catch((error: any) =>
        this.handleError(res, error, 'Error creating item')
      );
  };

  getAll = (req: Request, res: Response) => {
    this.model
      .find()
      .then((items: T[]) => res.status(HTTP_STATUS_CODES.OK).json(items))
      .catch((error: any) =>
        this.handleError(res, error, 'Error fetching items')
      );
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.model
      .findById(id)
      .then((item: T | null) => {
        if (!item) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'Item not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(item);
      })
      .catch((error: any) =>
        this.handleError(res, error, 'Error fetching item')
      );
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const content = req.body;

    this.model
      .findByIdAndUpdate(id, content, { new: true, runValidators: true })
      .then((item: T | null) => {
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

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    this.model
      .findByIdAndDelete(id)
      .then((item: T | null) => {
        if (!item) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'Item not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(item);
      })
      .catch((error: any) =>
        this.handleError(res, error, 'Error deleting item')
      );
  };

  handleError(res: Response, error: any, customMessage: string) {
    console.log(error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: 'Validation error',
        errors: errorMessages,
      });
    }
    if (error.code === 11000) {
      const duplicatedKey = Object.keys(error.keyValue)[0];
      return res
        .status(HTTP_STATUS_CODES.CONFLICT)
        .json({ message: `${duplicatedKey} field already in use` });
    }
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: customMessage });
  }
}

export default BaseController;
