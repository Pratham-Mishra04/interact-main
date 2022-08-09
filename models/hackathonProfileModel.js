import mongoose from "mongoose";

const hackathonProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    hackathon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hackathon'
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HackathonTeam'
    },

})

const HackathonProfile = mongoose.Model('HackathonProfile', hackathonProfileSchema);

export default HackathonProfile