const Movie = require('../models/movie.js');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ConflictError = require('../errors/conflict-err');

const {
  STATUS_OK, STATUS_CREATED, ERRMSG_NO_FILM, ERRMSG_FILM_EXISTS, ERRMSG_DELETE,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch(next);
};

module.exports.createMovie = async (req, res, next) => {
  const {
    movieId, country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail,
  } = req.body;

  try {
    const data = await Movie.find({ movieId });

    if (data.length > 0) {
      throw new ConflictError(`${ERRMSG_FILM_EXISTS} ${movieId}`);
    }

    const film = await Movie.create({
      movieId,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      owner: req.user._id,
    });

    res.status(STATUS_CREATED).send(film);
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      const errMessage = Object.values(err.errors).map((errItem) => errItem.message).join(', ');
      next(new BadRequestError(errMessage.trim()));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((film) => {
      if (!film) {
        throw new NotFoundError(ERRMSG_NO_FILM);
      }
      if (JSON.stringify(film.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError(ERRMSG_DELETE);
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((film) => res.status(STATUS_OK).send(film))
    .catch(next);
};
