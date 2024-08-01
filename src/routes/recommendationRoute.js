
const express = require('express');
const router = express.Router();
//const { getCalculation, getRecommendationAutoclave, getRecommendationWasher } = require('../controllers/recommendationController');
const { getCalculation } = require('../controllers/recommendationController');

router.get('/calculation/:id', getCalculation);
//router.get('/autoclave/:id', getRecommendationAutoclave);
//router.get('/washer/:id', getRecommendationWasher)

module.exports = router;
