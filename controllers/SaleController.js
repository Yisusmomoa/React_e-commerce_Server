import { Sequelize } from "sequelize";
import { Sale } from "../models/index.js";

class SaleController{

    static getAllSales(req, res){
        try {
            
        } catch (error) {
            res.status(400).send({error})
        }
    }
    
    static getOneSale(req, res){
        try {
            
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
    static deleteSale(req, res){
        try {
            
        } catch (error) {
            res.status(400).send({error})
        }
    }
    static updateSale(req, res){
        try {
            
        } catch (error) {
            res.status(400).send({error})
        }
    }
}


export default SaleController