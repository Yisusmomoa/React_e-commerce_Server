import express from "express"

import authMe from "../middleware/AuthMe.js"
import wishListController from "../controllers/wishListController.js"

const wishListRoutes=express.Router()

wishListRoutes.use(authMe)

// usar el token, el middleware authme
wishListRoutes.get("/", wishListController.showProductsWishList)

// obtener el id del user a través del middleware authme 
// y mandar el id del producto en el body
wishListRoutes.post("/", wishListController.addProductToWishList)

// obtener el id del user a través del middleware authme 
// y mandar el id del producto en la url
wishListRoutes.delete('/:id', wishListController.removeProductWishList)

export default wishListRoutes
