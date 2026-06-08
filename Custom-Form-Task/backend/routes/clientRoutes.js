const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { clientSchema } = require('../validations/client.validation');
const { createClient, getAllClients } = require('../controllers/clientController');

router.get('/all', getAllClients);
router.post('/create', validator(clientSchema), createClient);

module.exports = router;
