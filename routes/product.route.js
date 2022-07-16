const router = require('express').Router();

const { 
    getProducts,
    getProductById,
    getProductsBySellerId,
  } = require('../controllers/product.controller');
  
router.get('/all', getProducts)
router.get('/:id', getProductById)
router.get('/:sellerId', getProductsBySellerId)


module.exports = router;