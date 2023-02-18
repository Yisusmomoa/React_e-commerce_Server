import express from 'express'
import authMe from '../middleware/AuthMe.js'
import isAdmin from '../middleware/isAdmin.js'
import UserController from '../controllers/userController.js'

const userRoutes=express.Router()

// middleware en ruta

userRoutes.post("/", UserController.createUser)
userRoutes.post("/login", UserController.login)

userRoutes.use(authMe)
userRoutes.get("/me", UserController.me)

userRoutes.post("/logout", UserController.logOut)
userRoutes.put("/:id", UserController.updateUser)
userRoutes.delete("/:id", UserController.deleteUser)

userRoutes.use(isAdmin)
userRoutes.get("/:id", UserController.getUserById)
userRoutes.get("/", UserController.getAllUser)

export default userRoutes