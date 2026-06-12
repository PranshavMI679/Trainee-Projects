const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { configSchema , editFieldSchema } = require('../validations/config.validation');
const { getClientLayout, processConfigLayout, deleteFieldFromLayout } = require('../controllers/configController');

router.get('/:client_code/client-layout', getClientLayout);

router.post('/:identifier/process', validator(configSchema), processConfigLayout);
//router.post('/:client_code/create', validator(configSchema), createFormLayout);
//router.patch('/:config_code/edit-layout', validator(editFieldSchema), editConfiglayout);

router.delete('/:config_code/fields/:key/delete', deleteFieldFromLayout);

module.exports = router;
