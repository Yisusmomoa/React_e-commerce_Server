import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class Buy extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
Buy.init({
    subTotal:{
        type:DataTypes.DECIMAL(10,2)
    },
    superTotal:{
        type:DataTypes.DECIMAL(10,2)
    }
}, {
    sequelize: db,
    modelName: "Buy"
})
// console.log(Category === db.models.Category); 

export default Buy
