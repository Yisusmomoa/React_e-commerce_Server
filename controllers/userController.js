import { verify } from "jsonwebtoken";
import { generateToken } from "../config/token.js";
import { User } from "../models/index.js";
import bcrypt from 'bcrypt'
import { Op } from "sequelize";
import { Sequelize } from "sequelize"
import { registerMail } from "../utils/mails/registerMail.js";
import jwt from 'jsonwebtoken'

class UserController {
    static async createUser(req, res){
        try {
            const {username, password, email}=req.body
            const isEmailUsed=await User.findOne({
                where:{email:email}
            })
            if(isEmailUsed)throw "email must be unique"
            const result=await User.create({username,password, email});
            await registerMail(username, email);
            //node-cron
            //node-schedule
            res.status(201).send({
                success:true,
                message:"Usuario creado con exito",
                result
            })
        } catch (error) {
            // const err=error.errors[0].message
            return res.status(400).send({
                success:false,
                message:error,
            })
        }
    }

    static async getAllUser(req, res){
        try {
            const users=await User.findAll({
                attributes:["id", "username","isActive", 
                    "email", "role", "imgProfile", "RolId",
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
                ]
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
                attributes:["id", "username", "email", "role", "RolId", "imgProfile"]
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
                password,
                username,
                role,
                rolId
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
            if(password){
                const salt=user.salt
                const newPassword=await user.hashAuth(password, salt)
                user.password=newPassword
            }
            user.role=role|| user.role
            user.RolId=rolId|| user.RolId
            // user.profile=downloadUrl||user.profile
            // user.role=role || user.role
            await user.save()
            const payload={
                id:user.id,
                email:user.email,
                username:user.username,
                imgProfile:user.imgProfile,
                role:user.role,
                rolId:user.RolId,
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

    static async updateUserAdmin(req, res){
        try {
            const {
                email,
                password,
                username,
                role,
                rolId
            }=req.body

            const user=await User.findByPk(req.params.id)
            if(!user) throw "No se encontro el usuario"

            user.email=email||user.email
            user.username=username|| user.username
            user.password=password || user.password
            user.role=role|| user.role
            user.RolId=rolId|| user.RolId

            await user.save()
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
            const user=await User.findByPk(req.params.id)
            if(!user) throw "Usuario no encontrado"
            user.isActive=!user.isActive
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

    static async activateUser(req, res){
        try {
            const user=await User.findByPk(req.user.id)
            if(!user) throw "Usuario no encontrado"
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
                where:{
                    [Op.and]:[
                        {email},
                        {isActive:true}
                    ]
                }
            })
            if(!results) throw "No se encontro el usuario"

            // mando la password que vien del body
            const isEqual=await results.validatePassword(password)
           
            if(!isEqual) throw "Error en la contraseña o usuario"
            // le mandamos una key, eswta es la información que va a
            // almacenar el token
            const payload={
                id:results.id,
                email:results.email,
                username:results.username,
                imgProfile:results.imgProfile,
                role:results.role,
                rolId:results.RolId,
                imgProfile:results.imgProfile
            }
            const token=generateToken(payload)
            res.cookie("token", token, { 
            maxAge: 1800000, // 1 hora
            httpOnly: true,
            secure: true})
            res.cookie("tuptm", "tuptm")
            res.status(200).send({message:"Usuario logeado", success:true})
        } catch (error) {
            return res.status(400).send({
                success:false,
                message:error
            })
        }
    }

    // encargada de comprobar la cokkie/token
    static async me(req, res){
        console.log("req.user", req.user)
        try {
            res.status(200).send({
                success:true,
                message:"usuario encontrado",
                result:req.user
            })
        } catch (error) {
            return res.status(400).send({
                success:false,
                message:error
            })
        }
    }

    static async logOut(req, res){
        console.log("logout")
        try {
            
            res.clearCookie("token");
            res.clearCookie("tuptm");
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