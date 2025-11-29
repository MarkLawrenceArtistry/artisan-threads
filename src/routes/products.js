const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')
const upload = require('../middleware/upload')

router.post('/', upload.single('image'), productController.createProduct)
router.get('/:id', productController.getProduct)
router.get('/', productController.getAllProduct)
router.put('/:id', upload.single('image'), productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router