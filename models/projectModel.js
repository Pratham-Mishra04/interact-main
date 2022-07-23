import mongoose from "mongoose";
import validator from "validator";

const projectSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    link:{
        type:String,
        validate:{
            validator:function(val){
                return validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true })
            },
            message:"Enter a valid URL for Project Link"
        }
    },
    thumbnail:String,
    description:String,
    title:{
        type:String,
        required:true
    },
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
});

projectSchema.virtual("numLikes").get(function(){
    if(this.likers) return this.likers.length;
    else return 0
})

projectSchema.virtual("numComments").get(function(){
    if(this.comments) return this.comments.length;
    return 0
})

projectSchema.methods.isLiker= function (user){
    return this.likers.includes(user)
}


const Project= new mongoose.model("Project", projectSchema);

export default Project;