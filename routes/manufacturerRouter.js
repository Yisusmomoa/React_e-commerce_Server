import express from 'express'
import ManuFacturerController from '../controllers/manufacturerController.js'
const manufacturerRoutes=express.Router()


manufacturerRoutes.get("/", ManuFacturerController.getAllManufacturer)
manufacturerRoutes.get("/:id", ManuFacturerController.getManufacturerById)
manufacturerRoutes.post("/", ManuFacturerController.createManufacturer)
manufacturerRoutes.put("/:id", ManuFacturerController.updateManufacturer)
manufacturerRoutes.delete("/:id", ManuFacturerController.deleteManufacturer)

export default manufacturerRoutes