import { Router } from "express";
import userRoutes from "./userRoutes.js";
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'
import manufacturerRoutes from "./manufacturerRouter.js";
import wishListRoutes from "./wishListRoutes.js";
import buyRoutes from "./buyRoutes.js";

const routes=Router()
routes.use('/user', userRoutes)
routes.use('/category', categoryRoutes)
routes.use('/product', productRoutes)
routes.use('/manufacturer', manufacturerRoutes)
routes.use('/wishList', wishListRoutes)
routes.use('/buy', buyRoutes)
export default routes