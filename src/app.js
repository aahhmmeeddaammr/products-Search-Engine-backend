const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db');
const { initSearchEngine } = require('./services/searchEngine');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const startApp = async () => {
  try {
    await connectDB();
    initSearchEngine();
    
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the app:', error);
  }
};

startApp();

module.exports = app;
