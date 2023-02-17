import { Router } from "express";
import userRoutes from "./userRoutes.js";
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'

const routes=Router()
routes.use('/user', userRoutes)
routes.use('/category', categoryRoutes)
routes.use('/product', productRoutes)

export default routes