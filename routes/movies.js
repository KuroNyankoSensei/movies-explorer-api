const router = require('express').Router();

const { validateMovie, validateMovieId } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies.js');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
