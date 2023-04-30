import { verify } from "../config/token.js"
// middleware para desencriptar
const authMe=(req, res, next)=>{
    try {
        const token=req.cookies.token
        console.log("🚀 ~ file: AuthMe.js:6 ~ authMe ~ token:", token)
        if (!token) throw "token invalido"
        const data= verify(token)
        console.log("🚀 ~ file: AuthMe.js:9 ~ authMe ~ data:", data)
        if(!data) throw "no se encontro el usuario"
        // me muestra un object data que lleva dentro un payload
        // creo un objeto llamado user y mandarlo al req
        req.user=data
        next()
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:error.name
        })
    }
        
}

export default authMe