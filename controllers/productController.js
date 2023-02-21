
import { ImgProduct, Manufacturer, Product } from "../models/index.js";
import {Category} from "../models/index.js";
import imgProductController from "./ImgProductController.js"; 


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
                    },
                    {
                        model:ImgProduct, attributes:["LinkImg", "id"]
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
        // recibir la imagen y subirla a firebase/drive
        // luego obtener la ruta y guadrar la ruta
        // se pueden guardar maximo 3 imagenes por producto
        try {
            const result=await Product.create({
                name:name,
                price:price,
                CategoryId:CategoryId,
                description:description,
                ManuFacturerId:ManuFacturerId
            })
            if(!result) throw "Error, no se pudo dar de alta el producto"
            // se podrá hacer que funcione como middleware
            const idProd=result.id
            const files=req.files
            if(!await imgProductController.addImagesProduct(idProd, files)) throw "Error al subir las imagenes del producto"
            res.status(201).send({result, message:"Producto creado con exito"})
        } catch (error) {
            res.status(500).send({message:error})
        }
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
                    },
                    {
                        model:ImgProduct, attributes:["LinkImg", "id"]
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