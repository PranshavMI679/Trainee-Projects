const express = require('express');
const router = express.Router();

const form = require('./formRoutes');
router.use('/form', form);

const config = require('./configRoutes');
router.use('/config', config);

module.exports = router;