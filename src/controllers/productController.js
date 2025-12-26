const Product = require("../models/Product");
const { getEngine } = require("../services/searchEngine");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query parameter q is required" });
    }

    const searchQuery = q.trim();
    let sortedProducts = [];

    const engine = getEngine();
    const results = await engine.search(searchQuery, {
      collection: Product.collection.name,
    });
    if (results && results.length > 0) {
      const products = await Product.find({
        _id: { $in: results },
      }).lean();

      // Sort products to match search results order (relevance)
      sortedProducts = results.map((id) => products.find((p) => p._id.toString() === id.toString())).filter(Boolean);
    }

    // // 2. Fallback: If still zero results, try a broader Regex search
    // if (sortedProducts.length === 0) {
    //   console.log(`⚠️ Zero results found for "${searchQuery}". Attempting Regex fallback...`);
    //   sortedProducts = await performRegexSearch(searchQuery);
    // }

    res.json(sortedProducts);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};

// @desc    Force re-index all products
// @route   POST /api/products/reindex
// @access  Admin (Simplified)
const reindexProducts = async (req, res) => {
  try {
    const engine = getEngine();
    const products = await Product.find({}).lean();
    let indexed = 0;

    for (const product of products) {
      try {
        await engine.index(product, Product.collection.name, "en");
        indexed++;
      } catch (err) {
        console.error(`Error indexing ${product._id}:`, err.message);
      }
    }

    res.json({ message: `Successfully indexed ${indexed} products` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  reindexProducts,
};
