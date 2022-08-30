const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { MONGO_DB, PORT } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error-handler');
const routes = require('./routes/index.js');
const { allowedCors } = require('./utils/cors');

const app = express();

app.use(helmet());

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(cors(allowedCors));
app.use(routes);

app.use(errorLogger);
app.use(errors()); // oбработка ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
