const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { createClient, validateParams } = require('../validations/client.validation');
const { createModule } = require('../validations/module.validation');
const { handleCreateClient, getAllClients, getClientByCode, handleCreateModule, getAllModulesByClient } = require('../controllers/clientController');

router.get('/all', getAllClients);
router.get('/:client_code', getClientByCode);
router.post('/create', validator(createClient), handleCreateClient);

router.post('/module/:client_code/create', validator(createModule), handleCreateModule);
router.get('/module/:client_code/get-all', getAllModulesByClient);

module.exports = router;
