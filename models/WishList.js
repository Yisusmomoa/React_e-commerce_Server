import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";
import User from "./User.js";
import Product from "./Product.js";

class WishList extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
WishList.init({}, {
    sequelize: db,
    modelName: "WishList"
})
// console.log(Category === db.models.Category); 

export default WishList
