import { ImgProduct } from "../models/index.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'

import { firebaseConfig } from "../config/firebaseConfig.js";
import { Sequelize } from "sequelize";

// Initialize Firebase
initializeApp(firebaseConfig);
const storage=getStorage()


class imgProductController{
    static async addImagesProduct(idProd, files){
        for (let index = 0; index <files.length; index++) {
            const file=files[index]
            const storageRef=ref(storage, `product_Imgs/IdProd_${idProd}/${file.originalname}`)
            const metaData={
                contentType:file.mimetype
                // contentType:'image/jpeg'
            }
            const resultado=await uploadBytesResumable(storageRef, file.buffer, metaData)
            const downloadUrl=await getDownloadURL(resultado.ref)
            const result=ImgProduct.create({
                LinkImg:downloadUrl,
                ProductId:idProd
            })
            if(!result)return false
        }
        return true
    }

    // para el update de la imagen, usar el id del producto y luego el id de la imagen
    static async updateImgProduct(req,res){
        
    }

    static async deleteImgProduct(req, res){
        const {idImg, idProd}=req.body
        console.log(idImg, idProd)
        try {
            const result=await ImgProduct.destroy({
                where:{
                    id:idImg,
                    ProductId:idProd
                }
            })
            if(!result) throw "Error al momento de eliminar la imagen"
            res.status(200).send({
                message:"image deleted successfully",
                success:true
            })
        } catch (error) {
            return res.status(500).send({message:error})
        }
    }
}

export default imgProductController