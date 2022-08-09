import express from 'express'
import {protect} from '../controllers/authController'
import { createHack, restrictToOrganisation } from '../controllers/hackathonController'

const hackathonRouter= express.Router()

hackathonRouter.post('/createHack', protect ,restrictToOrganisation ,createHack)