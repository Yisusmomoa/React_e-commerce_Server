import { Router } from "express";
import userRoutes from "./userRoutes.js";
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'
import manufacturerRoutes from "./manufacturerRouter.js";

const routes=Router()
routes.use('/user', userRoutes)
routes.use('/category', categoryRoutes)
routes.use('/product', productRoutes)
routes.use('/manufacturer', manufacturerRoutes)
export default routes