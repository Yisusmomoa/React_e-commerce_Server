import { WishList, 
    Product, Category, 
    Manufacturer, User, 
    ImgProduct } from "../models/index.js";

class wishListController{
    
    static async addProductToWishList(req, res){
        try {
            const idProd=req.body.id
            const idUser=req.user.id
            const result=await WishList.create({
                UserId:idUser,
                ProductId:idProd
            })
            res.status(201).send(result)
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }

    static async showProductsWishList(req, res){
        try {
            const results=await User.findAll({
                attributes:["id", "username"],
                where:{id:req.user.id},
                include:[
                    {
                        model:Product,
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
                    }
                ]
            }) 
            const products=results[0].Products
            if(products.length==0) return res.status(200).send({
                message:"No cuentas con productos en tu wishlist",
                products
            }) 
            res.status(200).send({
                message:"Estos son tus productos en tu wishlist",
                products
            })
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }

    static async removeProductWishList(req, res){
        try {
            const idProd=req.params.id
            const idUser=req.user.id
            const result=await WishList.destroy({
                where:{
                    UserId:idUser,
                    ProductId:idProd
                }
            })
            if(result==0) throw "No se pudo elimiar el producto de tu wishlist"
            res.status(200).send({
                message:"Producto eliminado de tu wishlist"
            })
        } catch (error) {
            return res.status(400).send({message:error})
        }
    }
}

export default wishListController