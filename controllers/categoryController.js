import { Sequelize } from "sequelize"
import { Category } from "../models/index.js"

class CategoryController {
    static getAllCategories(req, res) {
        console.log("get all categories")
        Category.findAll({ 
            attributes:["id", "name", 
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
            .then(results => {
                let today=new Date()
                if (results.length === 0) throw "No hay categorias para mostrar"
                res.status(200).send({ success: true, message: "Categorias encontradas", results })
            }).catch(error => {
                res.status(400).send({ success: false, message: error })
            })
    }
    static async createCategory(req, res) {
        try {
            if(!req.body) throw "Llena los campos"
            const results = await Category.create(req.body)
            res.status(200).send({ success: true, message: "Categorias creada con exito", results })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async getCategoryById(req, res) {
        try {
            const results = await Category.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ["id", "name"]
            })
            if (!results) throw "No se encontro la categoria"
            res.status(200).send({ success: true, message: "Categorias encontradas", results })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async updateCategory(req, res) {
        try {
            const {name}=req.body
            const category=await Category.findByPk(req.params.id)
            if(!category) throw "No se encontro la categoría"
            category.name=name || category.name
            category.save()
            res.status(200).send({success:true,
                message: "Categoria actualizada con exito",
                 category})
                 
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }
    static async deleteCategory(req, res) {
        try {
            const results = await Category.destroy({
                where: {
                    id: req.params.id
                }
            })
            if (results == 0) throw "No se pudo eliminar la categoria"
            res.status(200).send({ success: true, message: "Categoria eliminada con exito", results })
        } catch (error) {
            res.status(400).send({ success: false, message: error })
        }
    }

}



export default CategoryController