import express from 'express'
import ManuFacturerController from '../controllers/manufacturerController.js'
import authMe from '../middleware/AuthMe.js'
import isAdmin from '../middleware/isAdmin.js'
import multer from 'multer'

const manufacturerRoutes=express.Router()
// ahora debo de pasar esta configuración como middleware a la ruta de createporduct
// recibe un objeto con las propiedades del storage
const fileUpload=multer({
    storage:multer.memoryStorage(),
}).single('imgBrand')

manufacturerRoutes.get("/", ManuFacturerController.getAllManufacturer)
manufacturerRoutes.get("/:id", ManuFacturerController.getManufacturerById)

manufacturerRoutes.use(authMe)
manufacturerRoutes.use(isAdmin)
manufacturerRoutes.post("/", fileUpload ,ManuFacturerController.createManufacturer)
manufacturerRoutes.put("/:id",fileUpload, ManuFacturerController.updateManufacturer)
manufacturerRoutes.delete("/:id", ManuFacturerController.deleteManufacturer)

export default manufacturerRoutes