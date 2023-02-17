import { Product } from "../models/index.js";
import {Category} from "../models/index.js";

class ProductController{

    static async getAllProducts(req, res){
        try {
            const products=await Product.findAll({
                attributes:["id", "name", "description", "price", "stock"],
                include:[
                    {
                        model:Category, required:true, attributes:["id", "name"]
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
        const {name, price, CategoryId, description, stock}=req.body
        try {
            const result=await Product.create({
                name:name,
                price:price,
                CategoryId:CategoryId,
                description:description,
                stock:stock
            })
            res.status(201).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    static async getOneProductById(req, res){
        try {
            const product=await Product.findOne({
                attributes:["id", "name", "description", "price", "stock"],
                include:[
                    {
                        model:Category, required:true, attributes:["id", "name"]
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
            res.status(500).send({error})
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
            return res.status(500).send({error})
        }
    }

    static async updateproduct(req, res){
        const {name, price, CategoryId, description, stock}=req.body
        try {
            const product=await Product.findByPk(req.params.id)
            if(!product) throw "No se encontro el producto"
            
            product.name=name || product.name
            product.price=price || product.price
            product.CategoryId=CategoryId || product.CategoryId
            product.description=description || product.description
            product.stock=stock || product.stock
            product.save()

            res.status(200).send(product)
        } catch (error) {
            return res.status(500).send({message:error})
            
        }
    }


}

export default ProductController