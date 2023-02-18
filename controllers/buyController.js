import { Buy, User, Product } from "../models/index.js";

class BuyController{
    static async getAllBuysFromUser(req, res){
        try {
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
    
    static async makeBuy(req, res){
        try {
            
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