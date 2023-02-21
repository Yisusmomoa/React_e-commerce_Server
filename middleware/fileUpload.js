import multer from "multer";

// ahora debo de pasar esta configuración como middleware a la ruta de createporduct
// recibe un objeto con las propiedades del storage
const fileUpload=multer({
    storage:multer.memoryStorage(),
}).array('images', 3)

export default fileUpload