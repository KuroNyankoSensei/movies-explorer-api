const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

// Получаем все сохраненные пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId })
    .then((movies) => {
      if (movies.length === 0) {
        res.send('Ничего не найдено');
      }
      res.send(movies);
    })
    .catch(next);
};

// Создаем фильм
module.exports.createMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.create({ owner: userId, ...req.body })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

// Удаляем сохраненный фильм по id
module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => new NotFound('Указанный фильм не найден'))
    .then((movie) => {
      if (String(movie.owner) !== userId) {
        throw new Forbidden('Удаление данного фильма невозможно');
      }
      return movie.remove()
        .then(() => {
          res.send(movie);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка.'));
      }
      return next(err);
    });
};
