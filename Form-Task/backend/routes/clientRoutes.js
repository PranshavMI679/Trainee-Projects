const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { clientSchema } = require('../validations/client.validation');
const { clientFormSpecs } = require('../controllers/clientController');

router.post('/specs', validator(clientSchema), clientFormSpecs);

module.exports = router;
