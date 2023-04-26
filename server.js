import express from 'express'
import morgan from 'morgan'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import db from './db/db.js';
import routes from './routes/index.js';
import cors from 'cors'

const port =process.env.PORT || 3000;
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// middlewares de terceros
app.use(cors({
    origin:'http://127.0.0.1:5173',
    credentials:true,
    allowedHeaders:true
}))
app.use(cookieParser())

app.use(morgan('tiny'))

app.use('/api', routes)
await db.sync({force:false}).then(()=>{
    app.listen(port ,'0.0.0.0', ()=>{
        console.log("servidor corriendo", port )
    })
})



