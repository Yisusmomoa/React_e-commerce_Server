import express from 'express'
import morgan from 'morgan'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import db from './db/db.js';
import routes from './routes/index.js';

const PORT=process.env.API_PORT
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// middlewares de terceros
app.use(cookieParser())
app.use(morgan('tiny'))

app.use('/api', routes)
await db.sync({force:false}).then(()=>{
    app.listen(PORT, ()=>{
        console.log("servidor corriendo", PORT)
    })
})

