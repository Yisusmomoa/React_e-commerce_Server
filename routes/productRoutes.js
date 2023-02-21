import express from "express"
import ProductController from "../controllers/ProductController.js"
import authMe from "../middleware/AuthMe.js"
import isAdmin from "../middleware/isAdmin.js"
import multer from "multer";

const productRoutes=express.Router()

// ahora debo de pasar esta configuración como middleware a la ruta de createporduct
// recibe un objeto con las propiedades del storage
const fileUpload=multer({
    storage:multer.memoryStorage(),
}).array('images', 3)

productRoutes.get("/",ProductController.getAllProducts)
productRoutes.get("/:id",ProductController.getOneProductById)

productRoutes.use(authMe)
productRoutes.use(isAdmin)
productRoutes.post("/",fileUpload, ProductController.createProduct)
productRoutes.put("/:id",fileUpload, ProductController.updateproduct)
productRoutes.delete("/:id", ProductController.deleteProduct)

export default productRoutes