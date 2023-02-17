import Buy from './Buy.js'
import Category from "./Category.js";
import DetailBuy from './DetailBuy.js';
import ImgProduct from './ImgProduct.js'
import Manufacturer from './Manufacturer .js'
import Product from "./Product.js";
import Rol from './Rol.js';
import User from "./User.js";
import WishList from './WishList.js';

// categorias de los productos
Category.hasMany(Product, {
    foreignKey: {
        allowNull: false
    },
    onDelete: "NO ACTION"
})
Product.belongsTo(Category)

// fabricantes de los productos
Manufacturer.hasMany(Product, {
    foreignKey:{
        allowNull:false
    }
})
Product.belongsTo(Manufacturer)

// imganes de los productos
Product.hasMany(ImgProduct)
ImgProduct.belongsTo(Product)

// Rol de los productos
Rol.hasMany(User)
User.belongsTo(Rol)

// compras
User.hasMany(Buy)
Buy.belongsTo(User)

// wishList
User.belongsToMany(Product, {through:WishList})
Product.belongsToMany(User, {through:WishList})

// Details buy
Buy.belongsToMany(Product, {through:DetailBuy})
Product.belongsToMany(Buy, {through:DetailBuy})


export { Category, Product, User }