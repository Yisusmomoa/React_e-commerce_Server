import express from 'express'
const categoryRoutes=express.Router()
import CategoryController from "../controllers/CategoryController.js";

categoryRoutes.get("/", CategoryController.getAllCategories)
categoryRoutes.get("/:id", CategoryController.getCategoryById)
categoryRoutes.post("/", CategoryController.createCategory)
categoryRoutes.put("/:id", CategoryController.updateCategory)
categoryRoutes.delete("/:id", CategoryController.deleteCategory)


export default categoryRoutes