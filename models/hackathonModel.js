import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    organiser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

hackathonSchema.virtual('teams',{
    ref:'HackathonTeams',
    foreignField:'hackathon',
    localField:'_id'
})

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;