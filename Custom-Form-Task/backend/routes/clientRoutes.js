const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { clientSchema } = require('../validations/client.validation');
const { moduleCreateSchema } = require('../validations/module.validation');

const { createClient, getAllClients, createModule, getAllModulesByClient } = require('../controllers/clientController');

router.get('/all', getAllClients);
router.post('/create', validator(clientSchema), createClient);

router.post('/module/:client_code/create', validator(moduleCreateSchema), createModule);
router.get('/module/:client_code/get-all', getAllModulesByClient);

module.exports = router;
