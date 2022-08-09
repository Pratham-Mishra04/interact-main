import Hackathon from "../models/hackathonModel.js";
import HackathonTeam from "../models/hackathonTeamModel.js";
import hackathonProfile from "../models/hackathonProfileModel.js";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import createDoc, { deleteDoc, updateDoc } from "../utils/HandlerFactory.js"

export const restrictToOrganisation = (req, res, next)=>{
    if(!req.user.organisationAcc) return next(new AppError("URL restricted to only Organisation Accounts", 400))
    next()
}

export const hackathonCheck = (req, res, next)=>{
    const hackathon = await Hackathon.findById(req.params.id)
    if(!hackathon) return next(new AppError("No Hackathon with this id exists", 400))
    if(Date.now()>hackathon.endDate) return next(new AppError("Hackathon has already ended", 400))
    next()
}

export const createHack = createDoc(Hackathon)
export const updateHack = updateDoc(Hackathon)
export const deleteHack = deleteDoc(Hackathon)

export const joinHack = catchAsync(async(req, res, next)=>{
    const hackathon= await Hackathon.findById(req.params.id);

    hackathon.participants.push(req.user.id)
    await hackathon.save({
        validateBeforeSave:false
    })

    const hackProfile = await HackathonProfile.create({
        user:req.user.id,
        hackathon:req.params.id
    })

    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        message :"Joined The Hackathon"
    })
})

export const createHackTeam = catchAsync(async(req, res, next)=>{
    if(hackProfile.team) return next(new AppError("Already in a Team", 400));
    else{
        const team = await new HackathonTeam.create({
            name: req.body.name,
            hackathon: req.params.id,
            members:[req.user.id],
            createdBy:req.user.id
        })
        hackProfile.team=team.id;
        hackProfile.save({
            validateBeforeSave:false
        })
    }
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        message :"Created The Hackathon Team"
    })
})

export const joinHackTeam = catchAsync(async (req, res, next)=>{
    const hackProfile = await HackathonProfile({user:req.user.id, hackathon:req.params.id})
    if(hackProfile.team) return next(new AppError("Already in a Team", 400));
    else{
        hackProfile.team=req.body.teamId;
        hackProfile.save({
            validateBeforeSave:false
        })
    }
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        message :"Joined The Hackathon Team"
    })
})

export const leaveHackTeam = catchAsync(async (req, res, next)=>{
    const hackTeam= await HackathonTeam.findById(req.params.id);
    if(!hackTeam) return next(new AppError("No Team with this id exists", 400));
    if(hackTeam.members.includes(req.user.id)){
        hackTeam.members.pop(req.user.id)
        hackTeam.save({
            validateBeforeSave:false
        })
        const hackathonProfile = await HackathonProfile.findOne({user:req.user.id})
        hackathonProfile.team= undefined;
        hackathonProfile.save({
            validateBeforeSave:false
        })
    }
    else return next(new AppError("Not in the team", 400))

    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        message :"Left The Hackathon Team"
    })
})