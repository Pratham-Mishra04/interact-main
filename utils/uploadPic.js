import multer from "multer";

const multerStrorage= multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')) cb(null, true)
    else cb(new AppError("Only images files are allowed", 400), false)
}

const uploadPhoto = multer({
    storage: multerStrorage,
    fileFilter: multerFilter
})

const uploadPic= name => uploadPhoto.single(`${name}`)

export default uploadPic