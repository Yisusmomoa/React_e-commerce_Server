import { DetailBuy } from "../models/index.js"


class detailBuyController{
    static async addProductsToDetailBuy(products, buyId){
        // convertir a un nuevo array con una nueva estrictura
        const productsInsert=products.map(product=>{
            return {
                ProductId:product.id,
                cantidad:product.amount,
                BuyId:buyId,
                totalProd:product.totalProd
            }
        })
        // ProductId, cantidad, totalProd
        // BuyId
        const result=await DetailBuy.bulkCreate(productsInsert)
        return result?true:false
    }
}

export default detailBuyController