import express, { Router } from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';
import {
  followandUnfollowUser,
  myProfile,
  updatePassword,
  updateProfile,
  userFollowerandFollowingData,
  userProfile,
} from '../controllers/userController.js';
import { User } from '../models/userModel.js';

const userRoutes = Router();
userRoutes.get('/me', isAuth, myProfile);
userRoutes.get('/:id', isAuth, userProfile);
userRoutes.put('/:id', isAuth, uploadFile, updateProfile);
userRoutes.post('/:id', isAuth, updatePassword);
userRoutes.post('/follow/:id', isAuth, followandUnfollowUser);
userRoutes.get('/followData/:id', isAuth, userFollowerandFollowingData);

export default userRoutes;
