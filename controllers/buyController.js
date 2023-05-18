import { Sequelize, where } from "sequelize";
import { Buy, Product, DetailBuy } from "../models/index.js";
import detailBuyController from "./detailBuyController.js";

class BuyController{
    static async getAllBuysFromUser(req, res){
        try {
          const idUser=req.user.id
          if(idUser){
            const results=await Buy.findAll({
                    attributes:["id", 
                        "subTotal", 
                        "superTotal", 
                        // "createdAt",[Sequelize.fn("to_char", Sequelize.col("createdAt"), "DD-MM-YYYY HH24:MI:SS"), "createdAt"],  
                    ],
                    where:{UserId:idUser},
                    include:[
                        {
                            model:Product,
                            attributes:["id", "name", "description", "price"],
                            // include:[
                            //     {
                            //         model:Category, required:true, attributes:["id", "name"]
                            //     },
                            //     {
                            //         model:Manufacturer, attributes:["id", "name"]
                            //     }
                            // ]
                        }
                    ],
                    order:[
                        ["id", "DESC"]
                    ]
              })
              if(!results) throw "No haz realizado compras"
              console.log("🚀 ~ file: buyController.js:43 ~ BuyController ~ getAllBuysFromUser ~ results:", results)
              res.status(200).send(results)
          }
          else{
            throw "Sessión expirada"
          }
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
    
    static async makeBuy(req, res){
        try {
            const idUser=req.user.id
            if(idUser){
                // recibir un array con los productos y calcular el total y subtotal
                const products=req.body
                // obtengo el precio de cada producto
                // convertir en función de la clase products?
                for (let index = 0; index < products.length; index++) {
                    const idProduct=products[index].id
                    const product=await Product.findOne({where:{id:idProduct}})
                    products[index].price=product.price
                    products[index].totalProd=product.price*products[index].amount
                }
                const subTotal=products.reduce((acc, el)=>parseFloat(acc)+parseFloat(el.price)*el.amount, 0)
                const superTotal=subTotal+subTotal*0.16
    
                const result=await Buy.create({
                    UserId:idUser,
                    subTotal,
                    superTotal
                })
                console.log("🚀 ~ file: buyController.js:76 ~ BuyController ~ makeBuy ~ result:", result)
                if(!result) throw "Error, al momento de realizar la compra"
    
                if(!detailBuyController.addProductsToDetailBuy(products, result.id)) throw "Error al momento de realizar la compra"
    
                res.status(201).send(result)
    
                // cuando haga una compra primero hago el insert
                // en la tabla Buy/Compra, una vez hecho ese insert me regresa
                // el id del ultimo insert, llamó desde aquí a un método
                // del detailBuyController y en ese método
                // hago el insert del id del producto FK, con su cantidad, total
                // y el id de la compra como FK
                // no se si usar un for o usar bulkcreate
            }
            else{
                throw "Sessión expirada"
            }

        } catch (error) {
            return res.status(400).send({message:error})
        }
    }

    static async getBuyByIdFromUser(req, res){
        try {
            const idUser=req.user.id
            const idBuy=req.params.id
            const results=await Buy.findOne({
                attributes:["id", 
                        "subTotal", 
                        "superTotal", 
                        "createdAt",[Sequelize.fn("to_char", Sequelize.col("createdAt"), "DD-MM-YYYY HH24:MI:SS"), "createdAt"],  
                ],
                include:[
                    {
                        model:Product,
                        attributes:["id", "name", "description", "price"],
                        // include:[
                        //     {
                        //         model:Category, required:true, attributes:["id", "name"]
                        //     },
                        //     {
                        //         model:Manufacturer, attributes:["id", "name"]
                        //     }
                        // ]
                    }
                ],
                where:{id:idBuy, UserId:idUser}
            })
            if(!results) throw "No se encontro la compra"
            res.status(200).send(results)
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
}

export default BuyController