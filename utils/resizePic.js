import sharp from "sharp";

const resizePic = (model, d1, d2) => (req, res, next)=>{
    if(!req.file) return next()
    req.file.filename = `${model}-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
    .resize(d1, d2)
    .toFormat('jpeg')
    .jpeg({quality: 100})
    .toFile(`public/img/${model}s/${req.file.filename}`)

    next()
}

export default resizePic