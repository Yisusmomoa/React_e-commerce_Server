import { DataTypes, Model } from "sequelize";
import db from "../db/db.js";
import {User} from "./index.js";
import {Product} from "./index.js";

class WishList extends Model{}

// como primer parametro le tengo que pasar un obj con los parametros de latabla
// y como segundo parametro la conexion a la db y el nombre de la tabla 
// Category.init({},{})
WishList.init({
    UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: User, // 'Movies' would also work
          key: 'id'
        }
      },
      ProductId: {
        type: DataTypes.INTEGER,
        references: {
          model: Product, // 'Actors' would also work
          key: 'id'
        }
      }

    }, {
    sequelize: db,
    modelName: "WishList"
})

export default WishList


/*

*/
