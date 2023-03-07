import { DataTypes , Model } from "sequelize";
import db from "../db/db.js";
import bcrypt from 'bcrypt'
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import "dotenv/config"
import { firebaseConfig } from "../config/firebaseConfig.js";

// Initialize Firebase
initializeApp(firebaseConfig);
const storage=getStorage()

class User extends Model {
    hashAuth(password, salt){
       return bcrypt.hash(password,salt)
    }

    // méotodo de instancia, por eso podemos usar el this
    async validatePassword(password ){
        const passwordHash=await this.hashAuth(password,
            this.salt)
        // console.log(passwordHash)
        // se compara con el que ya está
       return passwordHash===this.password
    }

    async uploadImgProfile(file, idUser){
        const storageRef=ref(storage, `user_Imgs/IdUser_${idUser}/${file.originalname}`)
        const metaData={
            contentType:file.mimetype
        }
        const resultado=await uploadBytesResumable(storageRef, file.buffer, metaData)
        const downloadUrl=await getDownloadURL(resultado.ref)
        return downloadUrl
    }
 }

User.init({
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate:{
            notNull:{
                msg:"Please enter a username"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg:"Please enter a password"
            },
        }
    },
    salt:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            isEmail:true,
            
            notNull:{
                msg:"Please enter a email"
            },
            
        }
    },
    role: {
        type: DataTypes.STRING(25)
    },
    imgProfile:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
}, {
    sequelize: db,
    modelName: "User"
})

// llamamos a la función beforeCreate
// y llamamos la funcion genSaltes una función asincrona
User.beforeCreate(async (user, options)=>{
    // console.log(user, options)
    // salt es un código que viene hasheado que vamos a acoplar a nuestro password
    // un numero random
    // me genera un numero aleatoro
    const salt=await bcrypt.genSalt() //esto me regresa una promesa
    // console.log(salt)
    // accedemos al salt del user y lo igualamos al salt que acabamos de generar
    user.salt=salt

    const passwordHash=await user.hashAuth(user.password,
        user.salt)
        // me devuelve una "nueva password" y luego se lo pasamos al user.password
    console.log(passwordHash)
    user.password=passwordHash
})

User.afterCreate(async user=>{
    if(user.id===1){
        return await user.update({role:"admin", RolId:1})
    }
    else{
        return await user.update({role:"normal", RolId:3})
    }
})

export default User