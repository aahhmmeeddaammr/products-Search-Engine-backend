const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  searchProducts,
  reindexProducts,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.post('/reindex', reindexProducts);

module.exports = router;
