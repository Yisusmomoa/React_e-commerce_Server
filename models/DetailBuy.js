import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";
import User from "./User.js";
import Product from "./Product.js";

class DetailBuy extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
DetailBuy.init({
    cantidad:{
        type:DataTypes.INTEGER
    },
    totalProd:{
        type:DataTypes.DECIMAL(10,2)
    }
}, {
    sequelize: db,
    modelName: "DetailBuy"
})

export default DetailBuy
