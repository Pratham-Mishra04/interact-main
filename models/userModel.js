import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import slugify from "slugify";
import AppError from "../managers/AppError.js";

const userSchema = new mongoose.Schema({
    //BASIC
    name:{
        type:String,
        required:[true, "Please provide the name"],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:[true, "Please provide the email"],
        trim:true,
        lowercase:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },
    profilePic:{
        type:String
    }, 
    age:{
        type:Number,
        required:true
    },
    phoneNo:{
        type:Number
    },
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    bio:{
        type:String,
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true, "Please confirm the password"],
        validate:{
            validator: function(el){
                return el==this.password;
            },
            message:"Passwords do not match"
        }
    },
    passwordChangedAt:{
        type:Date,
        default:Date.now()
    },
    //ACADEMIC
    uniName:String,
    Gradyear:Date,
    CourseName:String,
    cgpa:Number,
    typeOfProfile:{
        type:String,
        enum:{
            values:["bronze", "silver", "gold"],
            default:"bronze"
        }  
    },
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    organisationAcc:{
        type:Boolean,
        default:false
    },
    admin:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    },
    passwordResetToken:String,
    passwordResetTokenExpiresIn:Date

},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
});

userSchema.virtual('numFollowing').get(function(){
    return this.following.length
})

userSchema.virtual('followers',{
    ref:'User',
    foreignField:'following',
    localField:'_id'
})

userSchema.virtual('numFollowers').get(function(){
    if(this.followers) return this.followers.length
    return undefined
})

userSchema.virtual('posts',{
    ref:'Post',
    foreignField:'user',
    localField:'_id'
})

userSchema.virtual('projects',{
    ref:'Project',
    foreignField:'user',
    localField:'_id'
})

userSchema.pre(/^find/, function(next){
    this.find({active:true});
    next()
})

userSchema.pre("save", async function(next){
    if(!this.isModified('password'))  return next()
    if(this.password!=this.confirmPassword) return next(new AppError("Passwords do not match", 400))
    this.password= await bcrypt.hash(this.password, 12)
    this.confirmPassword=undefined
    next()
})

userSchema.pre(/^find/, function(next){
    this.find({active:true})
    next()
})


userSchema.pre(/^find/, function(next){
    // this.populate({
    //     path:"following",
    //     select:"username"
    // })
    next()
})

userSchema.methods.correctPassword = async function (inPass, userPass){
    return await bcrypt.compare(inPass, userPass)
};

userSchema.methods.changedPasswordAfter =  function (JWTTimestrap){
    const changedTimestrap=parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestrap<changedTimestrap
}

userSchema.methods.isFollowing = function(userID){
    if(this.following){
        for(var i=0;i<this.following.length;i++){
            if(this.following[i].id==userID) return true
        }
    }
    return false
}

userSchema.methods.createPasswordResetToken= async function(){
    const token= crypto.randomBytes(32).toString('hex');
    this.passwordResetToken= await bcrypt.hash(token, 4)
    this.passwordResetTokenExpiresIn= Date.now() + 10*60*1000;
    return token
}

userSchema.methods.resetTokenExpired= function(){
    if(this.passwordResetTokenExpiresIn) return Date.now()>this.passwordResetTokenExpiresIn;
}

userSchema.methods.correctPasswordResetToken = async function (inToken, userToken){
    return await bcrypt.compare(inToken, userToken)
};

const User = mongoose.model("User", userSchema);

export default User;