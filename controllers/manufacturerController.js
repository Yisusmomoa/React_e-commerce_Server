import { Manufacturer } from "../models/index.js"

class ManuFacturerController {
    static async getAllManufacturer(req, res){
        try {
            const results=await Manufacturer.findAll({
                attributes:["id", "name", "imgManuFacturer"]
            })
            res.status(200).send(results)
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async createManufacturer(req, res){
        try {
            const {name, imgManuFacturer}=req.body
            const result=await Manufacturer.create({
                name,
                imgManuFacturer
            })
            res.status(201).send(result)
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }

    static async getManufacturerById(req, res){
        try {
            const id=req.params.id
            const result=Manufacturer.findOne({
                attributes:["id", "imgManuFacturer"],
                where:{id}
            })
            if(!result) throw "No se encontro el producto"
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }

    static async deleteManufacturer(req, res){
        try {
            const result=await Manufacturer.destroy({
                where:{id:req.params.id}
            })
            if(result==0) throw "No se pudo eliminar la fabrica"
            res.status(200).send({
                result,
                message:"Fabrica eliminada con exito"
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async updateManufacturer(req, res){
        try {
            const {
                name,
                imgManuFacturer
            }=req.body
            const result=await Manufacturer.findByPk(req.params.id)
            if(!result) throw "No se encontro esa fabrica"
            result.name=name||result.name
            result.imgManuFacturer=imgManuFacturer|| result.imgManuFacturer
            await result.save
            res.status(200).send({
                message:"marca editada con exito"
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
}

export default ManuFacturerController