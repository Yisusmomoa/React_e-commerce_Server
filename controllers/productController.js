
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
            return res.status(500).send({error})
        }
    }

    static async createProduct(req, res){
        const {name, price, CategoryId, description,ManuFacturerId }=req.body
        console.log("🚀 ~ file: productController.js:52 ~ ProductController ~ createProduct ~ price:", price)
        const priceAsNumber=Number.parseInt(price)
        const CategoryIdAsNumber=Number.parseInt(CategoryId)
        const ManuFacturerIdAsNumber=Number.parseInt(ManuFacturerId)
        const files=req.files
        // recibir la imagen y subirla a firebase/drive
        // luego obtener la ruta y guadrar la ruta
        // se pueden guardar maximo 3 imagenes por producto
        try {
            if(!(name && price && CategoryId && description && ManuFacturerId && files))throw "no puedes dejar campos vacios"

            const result=await Product.create({
                name:name,
                price:priceAsNumber,
                CategoryId:CategoryIdAsNumber,
                description:description,
                ManuFacturerId:ManuFacturerIdAsNumber
            })
            if(!result) throw "Error, no se pudo dar de alta el producto"
            const idProd=result.id
          
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
        const priceAsNumber=Number.parseInt(price)
        const CategoryIdAsNumber=Number.parseInt(CategoryId)
        const ManuFacturerIdAsNumber=Number.parseInt(ManuFacturerId)
        const files=req.files
        try {
            const product=await Product.findByPk(req.params.id)
            
            if(!product) throw "No se encontro el producto"
            
            product.name=name || product.name
            if(price){
                if(price[0]!=='') product.price= price
            }
            product.price=priceAsNumber || product.price
            product.CategoryId=CategoryIdAsNumber || product.CategoryId
            product.description=description || product.description
            product.ManuFacturerId=ManuFacturerIdAsNumber|| product.ManuFacturerId
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
            })
            
            res.status(200).send(products)
        } catch (error) {
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
            const quantityProds=await Product.count();
            res.status(200).send({
                count:Number.parseInt(quantityProds),
                products,
            })
        } catch (error) {
            
        }
    }

    static async getProductsFilterPagination(req, res){
        try {
            const pageAsNumber=Number.parseInt(req.query.page);
            const sizeAsNumber=Number.parseInt(req.query.size);
            let page=0, size=10;
            if(!Number.isNaN(pageAsNumber) && pageAsNumber>0){
                page=pageAsNumber
            }
            if(!Number.isNaN(sizeAsNumber) && sizeAsNumber>0){
                size=sizeAsNumber
            }
            const{
                categoryId,
                brandId,
                priceMin,
                priceMax
            }=req.query
            let priceMinNumber=Number.parseInt(priceMin) ||0
            let priceMaxNumber=Number.parseInt(priceMax) ||0

            const where={}
            where[Op.and]=[]
            if (categoryId && categoryId>0) {
                where[Op.and].push({CategoryId:categoryId})
            }
            if(brandId && brandId>0){
                where[Op.and].push({ManuFacturerId:brandId})
            }
            // 0 100
            if((priceMinNumber || priceMaxNumber) && (priceMaxNumber>0 || priceMinNumber>0)){
                where[Op.and].push({
                    price:{
                        [Op.between]:[priceMinNumber, priceMaxNumber]
                    }
                })
            }
            
            const products=await Product.findAll({
                attributes:["id", "name", "description", "price"],
                limit:size,
                offset:page*size,
                include:[
                    // {
                    //     model:Category, required:true, attributes:["id", "name"]
                    // },
                    // {
                    //     model:Manufacturer, attributes:["id", "name"]
                    // },
                    {
                        model:ImgProduct, attributes:["LinkImg", "id"]
                    }
                ],
                where:where
            })
            
            
            res.status(200).send({
                count:Number.parseInt(products.length),
                products,
            })
        } catch (error) {
            return res.status(500).send({error})
        }
    }

    static async deleteImgProduct(req, res){
        const {idImg, idProd}=req.body
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

export default ProductController