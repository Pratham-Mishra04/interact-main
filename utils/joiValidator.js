import Joi from 'joi'
import User from '../models/userModel.js';
import catchAsync from '../managers/catchAsync.js'
import { isValidNumber } from 'libphonenumber-js';

const joiUserCreateSchema = Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/, 'alpha').required(),
    email:Joi.string().email().lowercase().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }).required(),
    username: Joi.string().alphanum().lowercase().custom(async (value, helper)=>{
        const user= await User.find({username: value});
        if(user) return helper.message("User with this username already exists")
    }).required(),
    age:Joi.number(),
    password:Joi.string().min(8).required(),
    confirmPassword: Joi.ref('password'),
    bio: Joi.string().max(50),
    phoneNo:Joi.string().custom((value, helper)=>{
        if(!isValidNumber(value)) return helper.message("Enter a valid phone number")
    }),
    uniName: Joi.string().max(25),
    gradYear: Joi.date(),
    CourseName: Joi.string().max(30),
    cgpa: Joi.number(),
    active: Joi.forbidden(),
    admin: Joi.forbidden(),
    following: Joi.forbidden(),
    typeOfProfile: Joi.forbidden()
})

const joiUserUpdateSchema =Joi.object({
    name:Joi.forbidden(),
    email:Joi.string().email().lowercase().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }),
    username: Joi.string().alphanum().lowercase().custom(async (value, helper)=>{
        const user= await User.find({username: value});
        if(user) return helper.message("User with this username already exists")
    }).required(),
    password:Joi.forbidden(),
    bio: Joi.string().max(50),
    phoneNo:Joi.string().custom((value, helper)=>{
        if(!isValidNumber(value)) return helper.message("Enter a valid phone number")
    }),
    uniName: Joi.string().max(25),
    gradYear: Joi.date(),
    CourseName: Joi.string().max(30),
    cgpa: Joi.number(),
    active: Joi.forbidden(),
    admin: Joi.forbidden(),
    following: Joi.forbidden(),
    typeOfProfile: Joi.forbidden()
})

export const joiUserCreateValidator = catchAsync(async (req, res, next)=>{
    const value= await joiUserCreateSchema.validateAsync(req.body);
    next()
})

export const joiUserUpdateValidator = catchAsync(async (req, res, next)=>{
    const value= await joiUserUpdateSchema.validateAsync(req.body);
    next()
})