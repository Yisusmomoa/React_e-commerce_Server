import express from 'express'
import authMe from '../middleware/AuthMe.js'
import isAdmin from '../middleware/isAdmin.js'
import UserController from '../controllers/userController.js'

import multer from "multer";

// ahora debo de pasar esta configuración como middleware a la ruta de createporduct
// recibe un objeto con las propiedades del storage
const fileUpload=multer({
    storage:multer.memoryStorage(),
}).single('avatar')

const userRoutes=express.Router()
// middleware en ruta

userRoutes.post("/", UserController.createUser)
userRoutes.post("/login", UserController.login)

userRoutes.use(authMe)
userRoutes.get("/me", UserController.me)

userRoutes.post("/logout", UserController.logOut)
userRoutes.put("/:id", fileUpload, UserController.updateUser)
userRoutes.delete("/:id", UserController.deleteUser)

userRoutes.use(isAdmin)
userRoutes.get("/:id", UserController.getUserById)
userRoutes.put("/admin/users/:id",  UserController.updateUserAdmin)
userRoutes.get("/", UserController.getAllUser)

export default userRoutes