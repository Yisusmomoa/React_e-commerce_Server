import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";

class Product extends Model { }

Product.init({
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate:{
            len:[2,20]
        }
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    
}, {
    sequelize: db,
    modelName: `Product`
})

export default Product