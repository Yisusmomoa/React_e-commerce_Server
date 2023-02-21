import { verify } from "jsonwebtoken";
import { generateToken } from "../config/token.js";
import { User } from "../models/index.js";
import bcrypt from 'bcrypt'

class UserController {
    static async createUser(req, res){
        try {
            const {username, password, email}=req.body
            const result=await User.create({username,password, email});
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
                attributes:["id", "username","isActive", "email", "role", "imgProfile"]
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
                attributes:["id", "username","isActive", "email", "role", "imgProfile"]
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
                email,
                username,
                password,
                role
            }=req.body
            const avatar=req.file
            const user=await User.findByPk(req.params.id)
            if(!user) throw "No se encontro el usuario"
            if(avatar){
                const resUploadImg=await user.uploadImgProfile(avatar, user.id)
                user.imgProfile=resUploadImg||user.imgProfile
            }
            user.email=email||user.email
            user.username=username|| user.username
            user.password=password || user.password
            // user.profile=downloadUrl||user.profile
            // user.role=role || user.role
            user.save()
            const payload={
                id:user.id,
                email:user.email,
                username:user.username,
                imgProfile:user.imgProfile,
                role:user.role,
            }
            const token=generateToken(payload)
            res.cookie("token", token)
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
            const user=await User.findByPk(req.user.id)
            if(!user) throw "Usuario no encontrado"
            console.log(user)
            user.isActive=false
            await user.save()
            res.status(200).send({
                success:true,
                user
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
           
            if(!isEqual) throw "Error en la contraseña"
            // le mandamos una key, eswta es la información que va a
            // almacenar el token
            const payload={
                id:results.id,
                email:results.email,
                username:results.username,
                imgProfile:results.imgProfile,
                role:results.role,
                imgProfile:results.imgProfile
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