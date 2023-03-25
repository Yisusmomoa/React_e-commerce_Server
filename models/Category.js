import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class Category extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
}, {
    // timestamps:false,
    sequelize: db,
    modelName: "Category"
})

export default Category

