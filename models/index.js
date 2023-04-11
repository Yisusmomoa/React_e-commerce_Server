import Buy from './Buy.js'
import Category from "./Category.js";
import DetailBuy from './DetailBuy.js';
import ImgProduct from './ImgProduct.js'
import Manufacturer from './Manufacturer .js'
import Product from "./Product.js";
import Rol from './Rol.js';
import User from "./User.js";
import WishList from './WishList.js';
import Sale from './Sale.js';

// categorias de los productos
Category.hasMany(Product)
Product.belongsTo(Category)

// fabricantes de los productos
Manufacturer.hasMany(Product)
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

//Sale
//Sale tendrá la FK
Product.hasOne(Sale)
Sale.belongsTo(Product)


export { Category, Product, User, Manufacturer, Buy, DetailBuy, ImgProduct,Rol,WishList, Sale }