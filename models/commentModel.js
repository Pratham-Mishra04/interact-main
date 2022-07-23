import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment:String,
    likers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
})

commentSchema.virtual("numLikers").get(function(){
    return this.likers.length
})

// commentSchema.pre("save", function(next){
//     if(!this.post && !this.project) return next(new AppError("No Post or Project assigned to the comment", 401))
//     next()
// })

const Comment= new mongoose.model("Comment", commentSchema);

export default Comment