const express = require('express');
const router = express.Router();

const client = require('./clientRoutes');
router.use('/client', client);

const form = require('./formRoutes');
router.use('/form', form);

module.exports = router;