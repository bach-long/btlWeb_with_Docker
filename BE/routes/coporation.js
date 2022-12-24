var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const {addManager, createModel, createVersion, getAllProducts, getAllManagers} = require('../Controllers/CoporationController');

const {validateCoporation} = require('../Middlewares/roleValidator');

router.post('/addManager', addManager);

router.post('/newModel', createModel);

router.post('/newVersion', createVersion);

router.get('/products/all', getAllProducts);

router.get('/managers/all', getAllManagers);

module.exports = router;
