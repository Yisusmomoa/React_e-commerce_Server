import express from 'express'
const categoryRoutes=express.Router()
import CategoryController from "../controllers/categoryController.js";
import isAdmin from '../middleware/isAdmin.js';
import authMe from '../middleware/AuthMe.js';

categoryRoutes.get("/", CategoryController.getAllCategories)
categoryRoutes.get("/:id", CategoryController.getCategoryById)
categoryRoutes.use(authMe)
categoryRoutes.use(isAdmin)
categoryRoutes.post("/", CategoryController.createCategory)
categoryRoutes.put("/:id", CategoryController.updateCategory)
categoryRoutes.delete("/:id", CategoryController.deleteCategory)


export default categoryRoutes