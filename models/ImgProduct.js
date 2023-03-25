import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class ImgProduct extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
ImgProduct.init({
    LinkImg: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: "ImgProduct"
})

export default ImgProduct
