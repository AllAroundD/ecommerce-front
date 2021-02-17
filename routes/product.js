const express = require('express')
const router = express.Router()

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

// controller
const { create, listAll, remove, read } = require('../controllers/product')

// routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll)
router.delete('/product/:slug', authCheck, adminCheck, remove)
router.get('/product/:slug', read)

module.exports = router
