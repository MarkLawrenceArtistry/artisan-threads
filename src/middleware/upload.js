const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb means callback
        // (err, destination)
        cb(null, 'public/uploads/')
    },
    file: (req, file, cb) => {
        // we will create algorithm that makes unique names
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        cb(null, file.fieldName + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10 million bytes
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images only!')
    }
}

module.exports = upload