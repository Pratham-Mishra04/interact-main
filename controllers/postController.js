import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { addComment, addDocByUser, addLiker, deleteDoc, getAllDocs, getAllDocsByUser, getDoc, updateDoc } from "../utils/HandlerFactory.js";


export const getAllPosts= getAllDocsByUser(Post)
export const getPost= getDoc(Post)
export const updatePost= updateDoc(Post)
export const deletePost= deleteDoc(Post)
export const addPost= addDocByUser(Post)
export const addLikerToPost= addLiker(Post)
export const addCommentToPost= addComment(Post)

export const getUserPost= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.params.username).populate("posts");
    if(!user) return next(new AppError("User with this username does not exists", 401));
    const posts=user.posts
    res.status(200).json({
        status: 'success',
        results: posts.length,
        requestedAt: req.requestedAt,
        data: posts,
    })
})

export const getFeedPost= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.user.id).populate({
        path:"followings",
        select:"posts"
    }).populate("posts")     //how to populate the posts from the followings??
    let posts= user.posts;
    const following=user.followings
    // for(let i=0;i<user.numFollowing;i++){
    //     posts=[...posts, ...following[i].posts]
    // }
    following.forEach(el=>{
        posts=[...posts, ...el.posts]
    })
    posts.sort((a,b)=>b.createdAt-a.createdAt)
    res.status(200).json({
        status: 'success',
        results: posts.length,
        requestedAt: req.requestedAt,
        data: posts,
    })
})