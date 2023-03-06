import { Manufacturer } from "../models/index.js"

import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, 
    ref, uploadBytesResumable} from 'firebase/storage'
import { firebaseConfig } from "../config/firebaseConfig.js";
import { Sequelize } from "sequelize";
// Initialize Firebase
initializeApp(firebaseConfig);
const storage=getStorage()

class ManuFacturerController {
    static async getAllManufacturer(req, res){
        try {
            const results=await Manufacturer.findAll({
                attributes:["id", "name", "imgManuFacturer",
                    "createdAt",[
                        Sequelize.fn(
                            "DATE_FORMAT", 
                            Sequelize.col("createdAt"), 
                            "%d-%m-%Y %H:%i:%s", 
                        ),  
                        "createdAt",
                    ],
                    "updatedAt",[
                        Sequelize.fn(
                            "DATE_FORMAT", 
                            Sequelize.col("updatedAt"), 
                            "%d-%m-%Y %H:%i:%s", 
                        ),  
                        "updatedAt",
                    ]
                ],
                order:Sequelize.col('id')
            })
            res.status(200).send(results)
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async createManufacturer(req, res){
        try {
            const {name}=req.body
            const imgBrand=req.file
            if(!name || !imgBrand) throw "Llena los campos"
            const storageRef=ref(storage, `brand_Imgs/Brand_${name}/${imgBrand.originalname}`)
            const metaData={
                contentType:imgBrand.mimetype
            }
            const resultado=await uploadBytesResumable(storageRef, imgBrand.buffer, metaData)
            const downloadUrl=await getDownloadURL(resultado.ref)
            const result=await Manufacturer.create({
                name,
                imgManuFacturer:downloadUrl
            })
            // result.imgManuFacturer=downloadUrl
            // result.save()
            res.status(201).send(result)
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }

    static async getManufacturerById(req, res){
        try {
            const result=await Manufacturer.findOne({
                attributes:["id","name", "imgManuFacturer"],
                where:{id:req.params.id}
            })
            console.log("result ", result)
            if(!result) throw "No se encontro esa marca"
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
            if(result==0) throw "No se pudo eliminar la marca"
            res.status(200).send({
                result,
                message:"marca eliminada con exito"
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async updateManufacturer(req, res){
        try {
            //campos y id 
            const {name}=req.body
            const id=req.params.id
            const imgBrand=req.file
            //campos y id 

            // lo busca y si está lo edito, sino no hago nada
            const result=await Manufacturer.findByPk(id)
            if(!result) throw "No se encontro esa fabrica"

            // si el valor viene vacio o no lo mandan, dejo el que estaba
            result.name=name||result.name

            // proceso de subida de imagen a firebase y update de la ruta de la imagen en la db
            
            if(imgBrand){
                const storageRef=ref(storage, `brand_Imgs/Brand_${name}/${imgBrand.originalname}`)
                const metaData={
                    contentType:imgBrand.mimetype
                }
                const resultado=await uploadBytesResumable(storageRef, imgBrand.buffer, metaData)
                const downloadUrl=await getDownloadURL(resultado.ref)
                result.imgManuFacturer=downloadUrl || result.imgManuFacturer
            }
            await result.save()
            res.status(200).send({
                message:"marca editada con exito",
                result
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
}

export default ManuFacturerController