import Project from "../models/projectModel.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import { addComment, addDocByUser, addLiker, deleteDoc, getAllDocs, getAllDocsByUser, getDoc, updateDoc } from "../utils/HandlerFactory.js";


export const getAllProjects= getAllDocsByUser(Project)
export const getProject= getDoc(Project)
export const updateProject= updateDoc(Project)
export const deleteProject= deleteDoc(Project)
export const addProject= addDocByUser(Project)
export const addLikerToProject= addLiker(Project)
export const addCommentToProject= addComment(Project)

export const getUserProjects= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.params.username).populate("projects")
    if(!user) return next(new AppError("User with this username does not exists", 401));
    const posts=user.projects
    res.status(200).json({
        status: 'success',
        results: posts.length,
        requestedAt: req.requestedAt,
        data: posts,
    })
})

export const getFeedProjects= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.user.id).populate("followings")
    let projects= user.projects;
    const following=user.followings
    // for(let i=0;i<user.numFollowing;i++){
    //     posts=[...posts, ...following[i].posts]
    // }
    following.forEach(el=>{
        projects=[...projects, ...el.projects]
    })
    projects.sort((a,b)=>b.createdAt-a.createdAt)
    res.status(200).json({
        status: 'success',
        results: projects.length,
        requestedAt: req.requestedAt,
        data: projects,
    })
})