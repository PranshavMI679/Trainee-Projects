const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { configSchema , layoutReorderSchema } = require('../validations/form_config.validation');
const { getCombinedClientLayout, processConfigLayout, swapLayoutPositions, disableLayoutElement } = require('../controllers/configController');

router.get('/combined-layout/:client_code', getCombinedClientLayout);

router.post('/:client_code/process', validator(configSchema), processConfigLayout);

router.patch('/:config_code/swap-sorting', validator(layoutReorderSchema), swapLayoutPositions);

router.delete('/:config_code/disable', disableLayoutElement);

module.exports = router;
