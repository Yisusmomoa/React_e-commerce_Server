import express from 'express'
import ManuFacturerController from '../controllers/manufacturerController.js'
import authMe from '../middleware/AuthMe.js'
import isAdmin from '../middleware/isAdmin.js'

const manufacturerRoutes=express.Router()

manufacturerRoutes.get("/", ManuFacturerController.getAllManufacturer)
manufacturerRoutes.get("/:id", ManuFacturerController.getManufacturerById)

manufacturerRoutes.use(authMe)
manufacturerRoutes.use(isAdmin)
manufacturerRoutes.post("/", ManuFacturerController.createManufacturer)
manufacturerRoutes.put("/:id", ManuFacturerController.updateManufacturer)
manufacturerRoutes.delete("/:id", ManuFacturerController.deleteManufacturer)

export default manufacturerRoutes