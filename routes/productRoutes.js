import express from "express"
import ProductController from "../controllers/ProductController.js"
import authMe from "../middleware/AuthMe.js"
import isAdmin from "../middleware/isAdmin.js"
import fileUpload from "../middleware/fileUpload.js";

const productRoutes=express.Router()

productRoutes.get("/",ProductController.getAllProducts)
productRoutes.get("/filter", ProductController.getProductsFilter)
productRoutes.get("/:id",ProductController.getOneProductById)
productRoutes.get("/category/:id", ProductController.getProductsByCategory)
productRoutes.get("/brands/:id", ProductController.getProductsByBrand)
// busqueda de productos por el nombre

productRoutes.use(authMe)
productRoutes.use(isAdmin)
productRoutes.post("/",fileUpload, ProductController.createProduct)
productRoutes.put("/:id",fileUpload, ProductController.updateproduct)
productRoutes.delete("/:id", ProductController.deleteProduct)

export default productRoutes