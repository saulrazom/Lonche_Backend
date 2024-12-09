import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { Router } from 'express';
import User from '../types/User';
import ROLES from '../types/roles';
import USER_STATUS from '../types/userStatus';
import mongoose from 'mongoose';

export const googleAuth = (router: Router) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      (accessToken, refreshToken, profile, cb) => {
        // Aquí puedes mapear los datos del perfil al esquema de tu usuario si es necesario
        const user: User = {
          _id: new mongoose.Types.ObjectId(),
          name: profile.name?.familyName || '',
          email: profile.emails?.[0].value || '',
          status: USER_STATUS.ACTIVE,
          role: ROLES.USER,
          profilePic: profile.photos?.[0].value || '',
          joinDate: new Date(),
          numFollowers: 0,
          numFollowing: 0,
          lastname: profile.name?.familyName || '',
          birthdate: new Date('2000-10-10'),
          username: profile.emails?.[0].value.split('@')[0] || '',
        };

        console.log('User profile:', profile);
        return cb(null, user);
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user); // Almacena los datos del usuario en la sesión
  });

  passport.deserializeUser((user: User, cb) => {
    cb(null, user); // Recupera los datos del usuario desde la sesión
  });

  router.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SECRET_KEY!,
    })
  );

  router.use(passport.initialize());
  router.use(passport.session());
};
