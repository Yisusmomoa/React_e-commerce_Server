import { Sequelize } from "sequelize";
import { Category, ImgProduct, Manufacturer, Product, Sale } from "../models/index.js";

class SaleController{

    static async getAllSales(req, res){
        try {
            const sales=await Sale.findAll({
                attributes:["id", "desc", "dateInit", "dateEnd", "ProductId"],
                include:[
                    {
                        model:Product, required:true, attributes:["id", "name", "description", "price"],
                        include:[
                            {
                                model:Category, required:true, attributes:["id", "name"]
                            },
                            {
                                model:Manufacturer, attributes:["id", "name"]
                            },
                            {
                                model:ImgProduct, attributes:["LinkImg", "id"]
                            }
                        ]
                    }
                ]
            })
            res.status(200).send(sales)
        } catch (error) {
            res.status(400).send({error})
        }
    }
    
    static async getOneSale(req, res){
        try {
            const id=req.params.id
            const sale=await Sale.findOne({
                attributes:["id", "desc", "dateInit", "dateEnd", "ProductId"],
                include:[
                    {
                        model:Product, required:true, attributes:["id", "name", "description", "price"],
                        include:[
                            {
                                model:Category, required:true, attributes:["id", "name"]
                            },
                            {
                                model:Manufacturer, attributes:["id", "name"]
                            },
                            {
                                model:ImgProduct, attributes:["LinkImg", "id"]
                            }
                        ]
                    }
                ],
                where:{id}
            })
            if(!sale) {
                throw "No existe esa oferta, o ya finalizo"
            }
            res.status(200).send(sale)
        } catch (error) {
            res.status(400).send({error})
        }
    }

    static async createSale(req, res){
        try {
            const {
                ProductId,
                desc,
                dateInit,
                dateEnd
            }=req.body
            const date1=new Date(dateInit)
            const date2=new Date(dateEnd)

            //validar que la fecha de inicio no sea menor que el día de hoy
            if(date1>date2) throw 'La fecha de fin no puede ser antes que la fecha de inicio'

            // validar que la fecha de fin no sea menor que la fecha de inicio
            const today=new Date()
            if(date1<=today) throw 'La oferta solo se puede programar que empiece un día despues del día actual'
            
            const result=await Sale.create({
                desc,
                dateInit,
                dateEnd,
                ProductId
            })

            if(!result) throw 'Error, al crear la oferta'
            res.status(201).send({
                message:'pferta creada con exito',
                result
            })
        } catch (error) {
            res.status(400).send({error})
        }
    }

    static async deleteSale(req, res){
        try {
             const id=req.params.id
             const result=await Sale.destroy({
                where:{id}
             })
             if(!result) {
                throw "No se encontro la oferta"
            }
            res.status(200).send({result})
        } catch (error) {
            res.status(400).send({error})
        }
    }

    static async updateSale(req, res){
        try {
            const {
                desc,
                dateInit,
                dateEnd
            }=req.body
            const id=req.params.id
            // TODO primero buscar si existe, luego editar, mejor dejarlo como yo hago el update .l.
            const result=await Sale.update(
                {desc, dateInit, dateEnd},
                {where:{id}}
            );
            if(result[0] === 0) throw "Error al querer actualizar la oferta"
            res.status(200).send({result})
        } catch (error) {
            res.status(400).send({error})
        }
    }
}


export default SaleController