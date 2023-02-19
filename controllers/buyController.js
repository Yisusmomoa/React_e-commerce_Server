import { where } from "sequelize";
import { Buy, Product, DetailBuy } from "../models/index.js";
import detailBuyController from "./detailBuyController.js";

class BuyController{
    static async getAllBuysFromUser(req, res){
        try {
          
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
    
    static async makeBuy(req, res){
        try {
            const idUser=req.user.id
            // recibir un array con los productos y calcular el total y subtotal
            const {products}=req.body
            console.log(products)
            // obtengo el precio de cada producto
            // convertir en función de la clase products?
            for (let index = 0; index < products.length; index++) {
                const idProduct=products[index].idProduct
                const product=await Product.findOne({where:{id:idProduct}})
                products[index].price=product.price
                products[index].totalProd=product.price*products[index].cantidad
            }
            const subTotal=products.reduce((acc, el)=>parseFloat(acc)+parseFloat(el.price)*el.cantidad, 0)
            // console.log("Subtotal", subTotal)
            const superTotal=subTotal+subTotal*0.16

            const result=await Buy.create({
                UserId:idUser,
                subTotal,
                superTotal
            })
            if(!result) throw "Error, al momento de realizar la compra"
            // console.log("idCompra",result.id)

            if(!detailBuyController.addProductsToDetailBuy(products, result.id)) throw "Error al momento de realizar la compra"

            res.status(201).send(result)

            // cuando haga una compra primero hago el insert
            // en la tabla Buy/Compra, una vez hecho ese insert me regresa
            // el id del ultimo insert, llamó desde aquí a un método
            // del detailBuyController y en ese método
            // hago el insert del id del producto FK, con su cantidad, total
            // y el id de la compra como FK
            // no se si usar un for o usar bulkcreate

        } catch (error) {
            return res.status(400).send({message:error})
        }
    }

    static async getBuyByIdFromUser(req, res){
        try {
            
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
}

export default BuyController