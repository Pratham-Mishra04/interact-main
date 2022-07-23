import express from 'express'
import { addProject, deleteProject, getAllProjects, getProject, updateProject } from '../controllers/projectController.js'

const projectRouter= express.Router({mergeParams:true})

projectRouter.route('/').get(getAllProjects).post(addProject)

projectRouter.route('/:id').get(getProject).patch(updateProject).delete(deleteProject)

export default projectRouter