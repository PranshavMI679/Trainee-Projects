const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { clientSchema } = require('../validations/client.validation');
const { clientFormSpecs, editFormSpecs } = require('../controllers/clientController');

router.post('/specs', validator(clientSchema), clientFormSpecs);
router.patch('/:client_code/edit-specs', validator(clientSchema), editFormSpecs);

module.exports = router;
