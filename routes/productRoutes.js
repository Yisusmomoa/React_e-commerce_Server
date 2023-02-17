import express from "express"
import ProductController from "../controllers/ProductController.js"

const productRoutes=express.Router()

productRoutes.get("/",ProductController.getAllProducts)

productRoutes.get("/:id",ProductController.getOneProductById)

productRoutes.post("/", ProductController.createProduct)

productRoutes.put("/:id", ProductController.updateproduct)

productRoutes.delete("/:id", ProductController.deleteProduct)

export default productRoutes