import { Request, Response } from 'express';
import BaseController from '../utils/BaseController';
import userModel, { User } from '../models/User';

import HTTP_STATUS_CODES from '../types/http-status-codes';
import { hashPassword } from '../utils/password';
import mongoose, { Model } from 'mongoose';

class UsersController extends BaseController<User> {
  constructor(model: Model<User>) {
    super(model);
  }

  create = (req: Request, res: Response) => {
    const userData = req.body;

    const {
      followers,
      following,
      numFollowers,
      numFollowing,
      joinDate,
      status,
      creationDate,
      ...filteredUserData
    } = userData;

    hashPassword(filteredUserData.password)
      .then((hashedPassword) => {
        filteredUserData.password = hashedPassword;
        return this.model.create(filteredUserData);
      })
      .then((newUser: User) => {
        return res.status(HTTP_STATUS_CODES.CREATED).json(
          newUser.toObject({
            versionKey: false,
            transform: (doc, ret) => {
              delete ret.password; // Eliminar la contraseña del objeto a devolver
              return ret;
            },
          })
        );
      })
      .catch((error) => this.handleError(res, error, 'Error creating user'));
  };

  getAll = (req: Request, res: Response) => {
    this.model
      .find()
      .select(
        'id_city username profilePic bio joinDate numFollowers numFollowing'
      )
      .then((results) => {
        return res.status(HTTP_STATUS_CODES.OK).json(results);
      })
      .catch((error) => this.handleError(res, error, 'Error fetching users'));
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.model
      .findById(id)
      .select(
        'id_city username name lastname profilePic bio joinDate numFollowers numFollowing'
      )
      .then((user) => {
        if (!user) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'User not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(user);
      })
      .catch((error) => this.handleError(res, error, 'Error fetching user'));
  };

  suggestions = (req: Request, res: Response) => {
    const id = req.myUser!._id as string;

    this.model
      .find({ _id: { $ne: id } })
      .select(
        'id_city username profilePic bio joinDate numFollowers numFollowing'
      )
      .sort({ numFollowers: -1 })
      .limit(10)
      .then((users) => {
        return res.status(HTTP_STATUS_CODES.OK).json(users);
      })
      .catch((error) =>
        this.handleError(res, error, 'Error fetching user suggestions')
      );
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const userData = req.body;

    if (req.file) {
      userData.profilePic = (req.file as Express.MulterS3.File).location;
    } else {
      delete userData.profilePic;
    }

    this.model
      .findByIdAndUpdate(id, userData, { new: true })
      .select('-password')
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'User not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(updatedUser);
      })
      .catch((error) => this.handleError(res, error, 'Error updating user'));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    this.model
      .findByIdAndDelete(id)
      .select('-password') // Excluir el campo password
      .then((deletedUser) => {
        if (!deletedUser) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'User not found' });
        }
        return res.status(HTTP_STATUS_CODES.OK).json(deletedUser);
      })
      .catch((error) => this.handleError(res, error, 'Error deleting user'));
  };

  follow = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { _id: followerId } = req.myUser!;

    try {
      const userExists = await this.model.findOne({ _id: id });

      if (!userExists) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: 'User not found' });
        return;
      }

      const alreadyFollowing = await this.model.findOne({
        _id: id,
        followers: followerId,
      });

      if (alreadyFollowing) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Already following this user' });
        return;
      }

      await this.model.updateOne(
        { _id: id },
        {
          $addToSet: { followers: followerId },
          $inc: { numFollowers: 1 },
        }
      );
      await this.model.updateOne(
        { _id: followerId },
        {
          $addToSet: { following: id },
          $inc: { numFollowing: 1 },
        }
      );

      res.status(HTTP_STATUS_CODES.OK).json({ message: 'Followed' });
    } catch (error) {
      console.error('Error following user:', error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  };

  unfollow = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { _id: followerId } = req.myUser!;

    try {
      const userExists = await this.model.findOne({ _id: id });

      if (!userExists) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: 'User not found' });
        return;
      }

      const isFollowing = await this.model.findOne({
        _id: id,
        followers: followerId,
      });

      if (!isFollowing) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Not following this user' });
        return;
      }

      await this.model.updateOne(
        { _id: id },
        {
          $pull: { followers: followerId },
          $inc: { numFollowers: -1 },
        }
      );
      await this.model.updateOne(
        { _id: followerId },
        {
          $pull: { following: id },
          $inc: { numFollowing: -1 },
        }
      );

      res.status(HTTP_STATUS_CODES.OK).json({ message: 'Unfollowed' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  };
}

export default new UsersController(userModel);
