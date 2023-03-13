import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";
import {User} from "./index.js";
import {Product} from "./index.js";

class ShopCart extends Model{}

ShopCart.init({
    UserIdCart: {
        type: DataTypes.INTEGER,
        references: {
          model: User, // 'Movies' would also work
          key: 'id'
        }
    },
    ProductIdCart: {
        type: DataTypes.INTEGER,
        references: {
          model: Product, // 'Actors' would also work
          key: 'id'
        }
    },
    Quantity:{
        type:DataTypes.SMALLINT,
        allowNull:false,
        
    }
    }
    ,
    {sequelize:db,
    modelName:"ShopCart",
    comment: 'the table allows users to store the products they want to buy'})

ShopCart.sync({force:true})

export default ShopCart