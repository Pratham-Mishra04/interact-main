import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    photo:{
        type:String
    },
    caption:String,    
    likers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    createdAt:{
        type:Date,
        deafult:Date.now()
    }
},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
})

postSchema.virtual("numLikes").get(function(){
    return this.likers.length;
})

postSchema.virtual("numComments").get(function(){
    return this.comments.length;
})

postSchema.methods.isLiker= function (user){
    return this.likers.includes(user)
}

const Post= new mongoose.model("Post", postSchema);

export default Post;