
const express = require('express');
const router = express.Router();
const { getWasherModels, getOneWasherModel, getWasherModelsByBrand, createOneWasherModel, updateOneWasherModel, deleteOneWasherModel } = require('../controllers/washerModelController');

router.get('/', getWasherModels);
router.get('/by-brands', getWasherModelsByBrand);
router.get('/:id', getOneWasherModel);
router.post('/', createOneWasherModel);
router.put('/:id', updateOneWasherModel);
router.delete('/:id', deleteOneWasherModel);

module.exports = router;
