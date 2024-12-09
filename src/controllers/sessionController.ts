import { Request, Response } from 'express';
import userModel from '../models/User';
import HTTP_STATUS_CODES from '../types/http-status-codes';
import { verifyPassword, hashPassword } from '../utils/password';
import BaseController from '../utils/BaseController';
import { User } from '../models/User';
import { Model } from 'mongoose';
import { generateToken } from '../utils/jwt';
import { sendEmail } from '../utils/sendEmail';

class sessionController extends BaseController<User> {
  constructor(model: Model<User>) {
    super(model);
  }

  private filterUser(user: User) {
    return user.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    });
  }

  login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    this.model
      .findOne({ email })
      .then((user) => {
        if (!user) {
          return res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'Invalid username or password' });
        }

        verifyPassword(password, user.password as string)
          .then((isPasswordCorrect) => {
            if (!isPasswordCorrect) {
              return res
                .status(HTTP_STATUS_CODES.NOT_FOUND)
                .json({ message: 'Invalid username or password' });
            }

            const token = generateToken(user.toObject({ versionKey: false }));
            const filteredUser = this.filterUser(user);

            res
              .status(HTTP_STATUS_CODES.OK)
              .json({ token, user: filteredUser });
          })
          .catch((error) => {
            console.error(error);
            return res
              .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json({ message: 'Internal Server Error' });
          });
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error' });
      });
  };

  register = (req: Request, res: Response) => {
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
        const token = generateToken(newUser);
        const filteredUser = this.filterUser(newUser);

        sendEmail(filteredUser.email, filteredUser.username)
          .then(() => {
            res
              .status(HTTP_STATUS_CODES.CREATED)
              .json({ token, user: filteredUser });
          })
          .catch((emailError) => {
            console.error('Error sending email:', emailError);
            res.status(HTTP_STATUS_CODES.CREATED).json({
              token,
              user: filteredUser,
              emailError: 'Email failed',
            });
          });
      })
      .catch((error) => this.handleError(res, error, 'Error creating user'));
  };

  loginWithGoogle(req: Request, res: Response) {
    const googleUser = req.user as User;
    console.log(googleUser);

    if (!googleUser || !googleUser.email) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: 'No se pudo obtener el usuario de Google.' });
    }

    const {
      followers,
      following,
      numFollowers,
      numFollowing,
      joinDate,
      status,
      role,
      ...filteredUserData
    } = googleUser;

    // Verificar si el usuario ya existe en la base de datos
    this.model
      .findOne({ email: googleUser.email })
      .then((existingUser: User | null) => {
        if (existingUser) {
          const token = generateToken(existingUser);
          res.redirect(`${process.env.WEB_URL}/callback?token=${token}`);
          return;
        }

        this.model.create(filteredUserData).then((savedUser: User) => {
          // Genera el token JWT para el nuevo usuario
          const token = generateToken(savedUser);
          res.redirect(`${process.env.WEB_URL}/callback?token=${token}`);
        });
      })
      .catch(() => {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      });
  }

  profile = (req: Request, res: Response) => {
    const id = req.myUser?._id;

    this.model
      .findById(id)
      .select('-password')
      .then((user) => {
        if (!user) {
          res
            .status(HTTP_STATUS_CODES.NOT_FOUND)
            .json({ message: 'User not found' });
          return;
        }

        res.status(HTTP_STATUS_CODES.OK).json(user);
      });
  };
}

export default new sessionController(userModel);
