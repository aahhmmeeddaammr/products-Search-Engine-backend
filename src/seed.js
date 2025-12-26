const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const SearchIndex = require('./models/SearchIndex');
const connectDB = require('./config/db');
const { initSearchEngine } = require('./services/searchEngine');

dotenv.config();

const categories = ['Gaming Laptops', 'Consoles', 'PC Components', 'Peripherals', 'Gaming Chairs', 'VR Gear', 'Software', 'Merchandise'];
const brands = ['Razer', 'ASUS ROG', 'Logitech G', 'Corsair', 'SteelSeries', 'MSI', 'Alienware', 'HyperX', 'ZOTAC', 'NVIDIA', 'AMD', 'Sony PlayStation', 'Microsoft Xbox', 'Nintendo'];
const productTypes = ['GeForce RTX 4090', 'Mechanical Keyboard', 'Gaming Mouse', 'Wireless Headset', '4K Gaming Monitor', 'Ergonomic Gaming Chair', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch OLED', 'LHR Graphics Card', 'DDR5 RAM 32GB', 'NVMe Gen5 SSD'];
const adjectives = ['Elite', 'Legendary', 'Pro-Grade', 'Hertz-Killing', 'RGB-Sync', 'Ultra-Response', 'Stealth', 'Battle-Ready', 'Performance-Tuned', 'Overclocked'];

const generateProducts = (count) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const name = `${brand} ${adj} ${type} Edition ${i}`;
    const description = `The ${name} is engineered for professional gamers. Featuring ${adj.toLowerCase()} technology from ${brand}, this ${type.toLowerCase()} delivers unmatched performance in the ${category.toLowerCase()} category. Comes with customizable RGB lighting and premium build quality. Experience gaming at its peak with this ${adj.toLowerCase()} hardware. Product ID: GM-${i + 1000}.`;
    const price = parseFloat((Math.random() * 2000 + 50).toFixed(2));
    const image = `https://picsum.photos/seed/${i + 500}/600/400`;

    products.push({
      name,
      description,
      price,
      category,
      image,
      s__name: name,
      s__description: description
    });
  }
  return products;
};

const seedData = async () => {
  try {
    await connectDB();
    const engine = initSearchEngine();

    // Clear existing data
    await Product.deleteMany();
    await SearchIndex.deleteMany();
    console.log('🗑️  Existing data cleared');

    // Generate 100 products
    const products = generateProducts(100);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded`);

    // Index products
    let indexed = 0;
    for (const product of createdProducts) {
        try {
            await engine.index(product, Product.collection.name, 'en');
            indexed++;
            if (indexed % 20 === 0) console.log(`🔄 Indexed ${indexed}/100 products...`);
        } catch (err) {
            console.error(`Error indexing ${product._id}:`, err.message);
        }
    }
    console.log(`✅ ${indexed} products indexed for search`);

    console.log('🌱 Seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
