import express from "express"

import authMe from "../middleware/AuthMe.js"
import BuyController from "../controllers/buyController.js"

const buyRoutes=express.Router()

buyRoutes.use(authMe)

buyRoutes.post("/", BuyController.makeBuy)
buyRoutes.get("/", BuyController.getAllBuysFromUser)
buyRoutes.get("/:id", BuyController.getBuyByIdFromUser)


export default buyRoutes