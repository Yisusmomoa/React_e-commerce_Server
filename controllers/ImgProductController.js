import { ImgProduct } from "../models/index.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import "dotenv/config"
import { firebaseConfig } from "../config/firebaseConfig.js";

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
}

export default imgProductController