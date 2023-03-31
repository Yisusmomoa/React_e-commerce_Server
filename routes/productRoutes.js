import express from "express"
import ProductController from "../controllers/ProductController.js"
import authMe from "../middleware/AuthMe.js"
import isAdmin from "../middleware/isAdmin.js"
import fileUpload from "../middleware/fileUpload.js";
import imgProductController from "../controllers/ImgProductController.js";
import multer from "multer";

const productRoutes=express.Router()
const UpdateImgUpload=multer({
    storage:multer.memoryStorage(),
}).single('img')

productRoutes.get("/",ProductController.getAllProducts)
productRoutes.get("/pagination",ProductController.getPaginationProducts)
productRoutes.get("/filter", ProductController.getProductsFilterPagination)
productRoutes.get("/:id",ProductController.getOneProductById)
productRoutes.get("/category/:id", ProductController.getProductsByCategory)
productRoutes.get("/brands/:id", ProductController.getProductsByBrand)
// busqueda de productos por el nombre

productRoutes.use(authMe)
productRoutes.use(isAdmin)  
productRoutes.post("/",fileUpload, ProductController.createProduct)
productRoutes.put("/updateImg",UpdateImgUpload, imgProductController.updateImgProduct)
productRoutes.put("/:id",fileUpload, ProductController.updateproduct)
productRoutes.post("/deletImg", imgProductController.deleteImgProduct)
productRoutes.delete("/:id", ProductController.deleteProduct)

export default productRoutes