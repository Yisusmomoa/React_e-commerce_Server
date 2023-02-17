import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class Rol extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Rol.init({},{})
Rol.init({
    nameRol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
}, {
    sequelize: db,
    modelName: "Rol"
})
export default Rol