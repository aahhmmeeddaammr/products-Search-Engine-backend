const { SmartSearch, MongoIndex, RedisCache ,  } = require('node-smart-search');
const SearchIndex = require('../models/SearchIndex');

let engine;

const initSearchEngine = () => {
    try {
        const mongoIndex = new MongoIndex(SearchIndex);
        const redisCache = new RedisCache(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
        engine = new SmartSearch(mongoIndex, redisCache );
        console.log('✅ Search engine initialized');
        return engine;
    } catch (error) {
        console.error('❌ Failed to initialize search engine:', error);
        // Fallback or exit
    }
};

const getEngine = () => {
    if (!engine) {
        return initSearchEngine();
    }
    return engine;
};

module.exports = { initSearchEngine, getEngine };
