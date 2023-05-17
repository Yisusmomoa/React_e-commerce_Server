import { Sequelize } from "sequelize";
import { Rol } from "../models/index.js";

class RolController{
    static async creteRol(req, res){
        try {
            const [rolName, created]=await Rol.findOrCreate({
                where:{
                    nameRol:req.body.nameRol
                }
            })
            if(!created) throw 'Ya existe ese rol'
            res.status(201).send(rolName) 
        } catch (error) {
            return res.status(400).send({
                success:false,
                message:error,
            })
        }
    }
    static async showRols(req, res){
        try {
            const results=await Rol.findAll({
                attributes:["id", "nameRol"]
            })
            res.status(200).send(results) 
        } catch (error) {
            return res.status(400).send({
                success:false,
                message:error,
            })
        }
    }
}

export default RolController