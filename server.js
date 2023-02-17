import express from 'express'
import morgan from 'morgan'
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const PORT=8080
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// middlewares de terceros
app.use(cookieParser())
app.use(morgan('tiny'))

app.listen(PORT, ()=>{
    console.log("servidor corriendo")
})

