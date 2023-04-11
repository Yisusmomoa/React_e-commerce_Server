import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class Sale extends Model{}

Sale.init({
    desc:{
        type:DataTypes.SMALLINT,
        allowNull:false,
    },
    dateInit:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    dateEnd:{
        type:DataTypes.DATEONLY,
        allowNull:false
    }
}, {
   sequelize:db,
   modelName:'Sale'     
})

export default Sale