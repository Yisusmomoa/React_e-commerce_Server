import express from "express"
import ProductController from "../controllers/ProductController.js"
import authMe from "../middleware/AuthMe.js"
import isAdmin from "../middleware/isAdmin.js"

const productRoutes=express.Router()

productRoutes.get("/",ProductController.getAllProducts)
productRoutes.get("/:id",ProductController.getOneProductById)

productRoutes.use(authMe)
productRoutes.use(isAdmin)
productRoutes.post("/", ProductController.createProduct)
productRoutes.put("/:id", ProductController.updateproduct)
productRoutes.delete("/:id", ProductController.deleteProduct)

export default productRoutes