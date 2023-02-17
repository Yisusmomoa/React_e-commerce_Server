import express from 'express'
import authMe from '../middleware/AuthMe.js'
import isAdmin from '../middleware/isAdmin.js'
import UserController from '../controllers/userController.js'

const userRoutes=express.Router()
userRoutes.get("/", UserController.getAllUser)
// middleware en ruta
userRoutes.get("/me",authMe, UserController.me)
userRoutes.get("/:id", UserController.getUserById)
userRoutes.post("/", UserController.createUser)
userRoutes.post("/login", UserController.login)

userRoutes.use(authMe)
userRoutes.post("/logout", UserController.logOut)

userRoutes.use(isAdmin)
userRoutes.put("/:id", UserController.updateUser)
userRoutes.delete("/id", UserController.deleteUser)


export default userRoutes