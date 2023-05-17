import { Sequelize } from "sequelize";

import 'dotenv/config'

const DBPORT=process.env.DB_PORT
const DBNAME=process.env.DB_NAME
const DBUSERNAME=process.env.DB_USERNAME
const DBPASSWORD=process.env.DB_PASSWORD
const DBDIALECT=process.env.DB_DIALECT
const DBHOST=process.env.DB_HOST

//postgres
//mysql

// const db=new Sequelize(DBNAME, DBUSERNAME,DBPASSWORD,{
//     host:DBHOST,
//     dialect:DBDIALECT,
//     port:DBPORT
// })

const db=new Sequelize(DBHOST, {
  dialect:DBDIALECT,
  
})

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  export default db