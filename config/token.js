import jwt from 'jsonwebtoken'
import "dotenv/config"

const SECRET=process.env.SECRET

// primero generamos una función llamada generateToken,
//  para crar el token
export const generateToken=(payload)=>{
    const token= jwt.sign(
        payload, //la informaicón del usuario
        SECRET, //secret una palabra secreta, que toma como base para empezar a hashear
        { expiresIn: '30m' }
        // { expiresIn: '1h' }
    );
    return token;
}

// verificar el token
export const verify=(token)=>{
    return jwt.verify(token, SECRET)
}