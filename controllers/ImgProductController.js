import { ImgProduct } from "../models/index.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAkfXD7CLAEmbxBPhF4EwvkJ_COsBYkG-c",
    authDomain: "e-commerce-c409f.firebaseapp.com",
    projectId: "e-commerce-c409f",
    storageBucket: "e-commerce-c409f.appspot.com",
    messagingSenderId: "249035537922",
    appId: "1:249035537922:web:3b6b565fc33f567506b11b",
    measurementId: "G-8NTHQHPLJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

}

export default imgProductController