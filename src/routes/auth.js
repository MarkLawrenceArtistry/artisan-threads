const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/', authController.getAllUsers);
router.get('/:id', authController.getUser);

module.exports = router