import express from 'express'
import { addPost, deletePost, getAllPosts, getPost, updatePost } from '../controllers/postController.js'

const postRouter= express.Router({mergeParams:true})

postRouter.route('/').get(getAllPosts).post(addPost)

postRouter.route('/:id').get(getPost).patch(updatePost).delete(deletePost)

export default postRouter