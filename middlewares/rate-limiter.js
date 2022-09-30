const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 1000, // не более 1000 запросов
  standardHeaders: true,
  legacyHeaders: false,
});
