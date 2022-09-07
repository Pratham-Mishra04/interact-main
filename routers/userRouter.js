import express from "express";
import { signup, login, protect } from "../Controllers/authController.js";
import { getAllUsers, UpdatePassword, getUser, updateUser, deleteUser, filterBody, forgotPassword, resetPassword, uploadProficPic, resizeUserPic, follow } from "../Controllers/userController.js";
import postRouter from "./postRouter.js";
import projectRouter from "./projectRouter.js";
import { joiUserCreateValidator, joiUserUpdateValidator } from "../utils/joiValidator.js";

const userRouter= express.Router()

userRouter.post('/signup', joiUserCreateValidator, signup)
userRouter.post('/login',login)

userRouter.patch('/updatePassword', protect, UpdatePassword)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/resetPassword', resetPassword)

userRouter.get('/', getAllUsers)
userRouter.route('/:id')
.get(protect, getUser)
.patch(protect, joiUserUpdateValidator, uploadProficPic, resizeUserPic, filterBody, updateUser)
.delete(protect, deleteUser)

userRouter.route('/follow').post(protect, follow)

userRouter.use('/:username/posts', postRouter)
userRouter.use('/:username/projects', projectRouter)

export default userRouter