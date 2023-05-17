import express from 'express'
import RolController from '../controllers/rolController.js'



const rolRoutes=express.Router()

rolRoutes.post('/', RolController.creteRol)

export default rolRoutes