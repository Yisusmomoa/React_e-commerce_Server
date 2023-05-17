import express from 'express'
import RolController from '../controllers/rolController.js'

const rolRoutes=express.Router()

rolRoutes.post('/', RolController.creteRol)
rolRoutes.get('/', RolController.showRols)

export default rolRoutes