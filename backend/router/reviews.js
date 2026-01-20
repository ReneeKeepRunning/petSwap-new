const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helper/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, loggedCheck, isAuthorReview } = require('../middleware');

router.post(
  '/',
  loggedCheck,
  validateReview,
  catchAsync(reviews.reviewCreate)
);

router.delete(
  '/:reviewId',
  loggedCheck,
  isAuthorReview,
  catchAsync(reviews.reviewDelete)
);

module.exports = router;
