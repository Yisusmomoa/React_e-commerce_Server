import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class ManuFacturer extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// ManuFacturer.init({},{})
ManuFacturer.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    imgManuFacturer:{
        type:DataTypes.TEXT,
        allowNull:false
    }
}, {
    sequelize: db,
    modelName: "ManuFacturer"
})

export default ManuFacturer