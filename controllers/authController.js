import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const createToken= (id)=>{
    return jwt.sign({ id:id }, process.env.JWT_KEY, {expiresIn: process.env.JWT_TIME*24*60})
    
}

export const createSendToken = (user, statusCode, res)=>{
    const token=createToken(user._id) 
    user.password=undefined
    
    const cookieSettings={
        expires: new Date(
            Date.now() + process.env.JWT_TIME*24*60*60*1000
        ),
        httpOnly:true
    };

    if(process.env.NODE_ENV==="prod") cookieSettings.secure=true;

    res.cookie('jwt', token, cookieSettings)

    res.status(statusCode).json({
        status:"success",
        token:token,
        data:{
            user:user
        }
    })
}

export const signup = catchAsync(async (req,res, next)=>{
        const newUser= await User.create(req.body)
        createSendToken(newUser, 201, res)
})

export const login = catchAsync(async (req,res, next)=>{
        const { username, password } = req.body;

        if(!username || !password) return next(new AppError("Email or Password doesn't exists", 400));

        const user= await User.findOne({username:username}).select("+password")

        if(!user || !await user.correctPassword(password, user.password)) throw new AppError("Incorrect Email or Password", 400);

        createSendToken(user, 200, res)
})

export const protect = catchAsync(async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))token=req.headers.authorization.split(' ')[1]
    
    if(!token) return next(new AppError("You are not Logged in. Please Login to continue", 401))

    const decoded= await promisify(jwt.verify)(token, process.env.JWT_KEY)

    const user= await User.findById(decoded.id)

    if(req.params.id && decoded.id!=req.params.id) return next(new AppError("Please Login in as the Modifying User.", 401))

    if(!user) return next(new AppError("User of this token no longer exists", 401))

    if(user.changedPasswordAfter(decoded.iat)) return next(new AppError("Password was recently changed. Please Login again", 401))

    req.user=user;
    next()
}) 

export const restrictTo = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) return next(new AppError("You do not have the permission to perform this action", 403));
        next()
    } 
}