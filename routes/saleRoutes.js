import express from 'express';
import authMe from '../middleware/AuthMe.js';
import isAdmin from '../middleware/isAdmin.js';
import SaleController from '../controllers/SaleController.js';

const saleRoutes=express.Router()

saleRoutes.get('/', SaleController.getAllSales)

saleRoutes.get('/:id', SaleController.getOneSale)
saleRoutes.use(authMe)
saleRoutes.use(isAdmin)

saleRoutes.post('/', SaleController.createSale)

saleRoutes.delete('/:id', SaleController.deleteSale)

saleRoutes.put('/:id', SaleController.updateSale)


export default saleRoutes