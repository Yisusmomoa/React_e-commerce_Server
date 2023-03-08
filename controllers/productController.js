
import { Op, Sequelize, where } from "sequelize";
import { ImgProduct, Manufacturer, Product } from "../models/index.js";
import {Category} from "../models/index.js";
import imgProductController from "./ImgProductController.js"; 


class ProductController{

    static async getAllProducts(req, res){
        try {
            const products=await Product.findAll({
                attributes:["id", "name", "description", "price",
                    "createdAt",[
                        Sequelize.fn(
                            "DATE_FORMAT", 
                            Sequelize.col("Product.createdAt"), 
                            "%d-%m-%Y %H:%i:%s", 
                        ),  
                        "createdAt",
                    ],
                    "updatedAt",[
                        Sequelize.fn(
                            "DATE_FORMAT", 
                            Sequelize.col("Product.updatedAt"), 
                            "%d-%m-%Y %H:%i:%s", 
                        ),  
                        "updatedAt",
                    ]
                ],
                order:Sequelize.col('id'),
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
        const {name, price, CategoryId, 
            description, ManuFacturerId}=req.body
        console.log("body", req.body)
        console.log("price", price)
        const files=req.files
        try {
            const product=await Product.findByPk(req.params.id)
            
            if(!product) throw "No se encontro el producto"
            
            product.name=name || product.name
            if(price[0]!=='') product.price= price
            
            product.CategoryId=CategoryId || product.CategoryId
            product.description=description || product.description
            product.ManuFacturerId=ManuFacturerId|| product.ManuFacturerId
            if(files){
                if(!await imgProductController.addImagesProduct(req.params.id, files)) throw "Error al subir las imagenes del producto"
            }
            await product.save()

            res.status(200).send(product)
        } catch (error) {
            return res.status(500).send({message:error})
            
        }
    }

    static async getProductsByCategory(req, res){
        const idCategory=req.params.id
        try {
            const idBrand=req.params.id
            if(!idCategory) throw "Selecciona una categoria"
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
                ],
                where:{
                    CategoryId:idCategory
                }
            })
            if(!products) throw "No existen productos de esa marca"
            res.status(200).send(products)
        } catch (error) {
            console.log(error)
            return res.status(500).send({error})
        }
    }

    static async getProductsByBrand(req, res){
        
        try {
            const idBrand=req.params.id
            if(!idBrand) throw "Selecciona una marca"
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
                ],
                where:{
                    ManuFacturerId:idBrand
                }
            })
            if(!products) throw "No existen productos de esa marca"
            res.status(200).send(products)
        } catch (error) {
            console.log(error)
            return res.status(500).send({error})
        }
        
    }

    static async getProductsFilter(req, res){
        /*
            http://localhost:8080/api/product/filter?categoryId=2&brandId=1&priceMin=100&priceMax=1000
        */
        try {
            const{
                categoryId,
                brandId,
                priceMin,
                priceMax
            }=req.query
            const where={}
            where[Op.and]=[]
            if (categoryId) {
                where[Op.and].push({CategoryId:categoryId})
            }
            if(brandId){
                where[Op.and].push({ManuFacturerId:brandId})
            }
            if(priceMin || priceMax){
                where[Op.and].push({
                    price:{
                        [Op.between]:[priceMin, priceMax]
                    }
                })
            }
            
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
                ],
                where:where
                // where:{
                //     [Op.and]:[
                //         {ManuFacturerId:brandId},
                //         {CategoryId:categoryId},
                //     ],
                //     price:{
                //         [Op.between]:[priceMin, priceMax]
                //     }

                // }
            })
            
            res.status(200).send(products)
        } catch (error) {
            console.log(error)
            return res.status(500).send({error})
        }
        
    }

    static async getPaginationProducts(req, res){
        // const {page, size}=req.query;
        const pageAsNumber=Number.parseInt(req.query.page);
        const sizeAsNumber=Number.parseInt(req.query.size);
        let page=0, size=10;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber>0){
            page=pageAsNumber
        }
        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber>0){
            size=sizeAsNumber
        }
        try {
            const products=await Product.findAll({
                
                attributes:["id", "name", "description", "price",],
                limit:size,
                offset:page*size,
                // subQuery:false,
                order:['id'],
                include:[
                    {
                        model:ImgProduct, attributes:["LinkImg", "id"]
                    }
                ],
                
            })
            res.status(200).send({
                count:products.length,
                products,
            })
        } catch (error) {
            
        }
    }


}

export default ProductController