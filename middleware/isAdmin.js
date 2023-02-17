// middleware para validar que eres admin

const isAdmin=(req, res, next)=>{
    const {role}=req.user
    // objeto que creamos en authme
    if(role==="admin"){
        next()
    }
    else{
        // código unauthorizaed
        res.status(401).send({
            success:false,
            message:"Unauthorized access"
        })
    }
}

export default isAdmin