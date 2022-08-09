import mongoose from "mongoose";

const hackathonTeamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    hackathon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hackathon'
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const HackathonTeam = mongoose.model("HackathonTeam", hackathonTeamSchema)

export default HackathonTeam;