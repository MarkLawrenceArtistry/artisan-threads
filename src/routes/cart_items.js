const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartController')

router.post('/', cartController.addItem)
router.get('/', cartController.getAllItem)

router.get('/:id', cartController.getItem)
router.get('/cart/user/:id', cartController.getCart)
router.delete('/:id', cartController.deleteItem)

module.exports = router