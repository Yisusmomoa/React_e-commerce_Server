import { verify } from "jsonwebtoken";
import { generateToken } from "../config/token.js";
import { User } from "../models/index.js";
import bcrypt from 'bcrypt'

class UserController {
    static async createUser(req, res){
        try {
            const {name, lastName, password, email}=req.body
            const result=await User.create({name, lastName,password, email});
            res.status(201).send({
                success:true,
                message:"Usuario creado con exito",
                result
            })
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    static async getAllUser(req, res){
        try {
            const users=await User.findAll({
                attributes:["id", "name", 
                    "lastName", "password", "role"]
            })
            if(users.length===0) throw "No hay usuarios para mostrar"
            res.status(200).send(users)
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    static async getUserById(req, res){
        try {
            const user=await User.findOne({
                where:{id:req.params.id},
                attributes:["id", "name", 
                "lastName", "password", "role"]
            })
            if(!user) throw "No se encontro el usuario"
            res.status(200).send(user)
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    static async updateUser(req, res){
        try {
            const {
                name,
                lastName,
                email,
                username,
                password,
                role}=req.body
            
            const user=await User.findByPk(req.params.id)
            if(!user) throw "No se encontro el usuario"
            user.name=name|| user.name
            user.lastName=lastName||user.lastName
            user.email=email||user.email
            user.username=username|| user.username
            user.password=password || user.password
            user.role=role || user.role
            user.save()
            
            res.status(200).send({
                success:true,
                message:"Usuario editado con exito",
                user
            })
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    static async deleteUser(req, res){
        try {
            const result=await User.destroy({
                where:{id:req.params.id}
            })
            console.log(result)
            if(result===0) throw "Usuario no encontrado"
            res.status(200).send({
                success:true,
                result
            })
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    static async login(req, res){
        try {
            const {email, password}=req.body
            const results=await User.findOne({
                where:{email}
            })
            if(!results) throw "No se encontro el usuario"

            // mando la password que vien del body
            const isEqual=await results.validatePassword(password)
           
            if(!isEqual) throw "No se encontro el usuario"
            // le mandamos una key, 
            const payload={
                email:results.email,
                role:results.role,
            }
            const token=generateToken(payload)
            // este token tiene encriptada/hashaeada la información que le mande al payload
            console.log("token login controller", token)
            // las cookies tiene el token
            res.cookie("token", token)
            // console.log(req.cookies)
            res.status(200).send({message:"Usuario logeado", success:true})
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }

    // se encargada de comprobar la cokkie/token
    static async me(req, res){
        console.log("me", req.user)
        try {
            res.status(200).send({
                success:true,
                message:"usuario encontrado",
                result:req.user
            })
        } catch (error) {
            return res.status(404).send({
                success:false,
                message:error
            })
        }
    }

    static async logOut(req, res){
        try {
            console.log("logout")
            res.clearCookie("token");
            res.send(204)
        } catch (error) {
            return res.status(500).send({
                success:false,
                message:error
            })
        }
    }
    
}



export default UserController