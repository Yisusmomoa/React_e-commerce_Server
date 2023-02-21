
import { Manufacturer, Product } from "../models/index.js";
import {Category} from "../models/index.js";
import imgProductController from "./ImgProductController.js"; 
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

class ProductController{

    static async getAllProducts(req, res){
        try {
            const products=await Product.findAll({
                attributes:["id", "name", "description", "price"],
                include:[
                    {
                        model:Category, required:true, attributes:["id", "name"]
                    },
                    {
                        model:Manufacturer, attributes:["id", "name"]
                    }
                ]
            })
            res.status(200).send(products)
        } catch (error) {
            console.log(error)
            return res.status(500).send({error})
        }
    }

    static async createProduct(req, res){
        const {name, price, CategoryId, description,ManuFacturerId }=req.body

        for (let index = 0; index <req.files.length; index++) {
            const file=req.files[index]
            console.log("file", file)
            const storageRef=ref(storage, `product_Imgs/${file.originalname}`)
            const metaData={
                contentType:file.mimetype
            }
            const resultado=await uploadBytesResumable(storageRef, file.buffer, metaData)
            console.log("resultado", resultado)
            const downloadUrl=await getDownloadURL(resultado.ref)
            console.log("downloadUrl", typeof(downloadUrl))
            
        }

        // recibir la imagen y subirla a firebase/drive
        // luego obtener la ruta y guadrar la ruta
        // se pueden guardar maximo 3 imagenes por producto
        // try {
        //     const result=await Product.create({
        //         name:name,
        //         price:price,
        //         CategoryId:CategoryId,
        //         description:description,
        //         ManuFacturerId:ManuFacturerId
        //     })
        //     res.status(201).send(result)
        // } catch (error) {
        //     res.status(500).send({message:error})
        // }
    }

    static async getOneProductById(req, res){
        try {
            const product=await Product.findOne({
                attributes:["id", "name", "description", "price"],
                include:[
                    {
                        model:Category, required:true, attributes:["id", "name"]
                    },
                    {
                        model:Manufacturer, required:true, attributes:["id", "name"]
                    }
                ],
                where:{
                    id:req.params.id,
                },
            })
            if(!product) {
                throw "No se encontro el producto"
            }
            res.status(200).send(product)
        } catch (error) {
            res.status(500).send({message:error})
        }
    }

    static async deleteProduct(req, res){

        try {
            const result=await Product.destroy({
                where:{id:req.params.id}
            })
            if(!result) {
                throw "No se encontro el producto"
            }
            res.status(200).send({result})
        } catch (error) {
            return res.status(500).send({message:error})
        }
    }

    static async updateproduct(req, res){
        const {name, price, CategoryId, description, ManuFacturerId}=req.body
        try {
            const product=await Product.findByPk(req.params.id)
            if(!product) throw "No se encontro el producto"
            
            product.name=name || product.name
            product.price=price || product.price
            product.CategoryId=CategoryId || product.CategoryId
            product.description=description || product.description
            product.ManuFacturerId=ManuFacturerId|| product.ManuFacturerId
            product.save()

            res.status(200).send(product)
        } catch (error) {
            return res.status(500).send({message:error})
            
        }
    }


}

export default ProductController