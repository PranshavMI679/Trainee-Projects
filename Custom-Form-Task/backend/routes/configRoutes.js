const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { configSchema , editFieldSchema } = require('../validations/config.validation');
const { createFormLayout, getClientLayout, editConfiglayout, deleteFieldFromLayout } = require('../controllers/configController');

router.post('/:client_code/create', validator(configSchema), createFormLayout);
router.get('/:client_code/client-layout', getClientLayout);
router.patch('/:config_code/edit-layout', validator(editFieldSchema), editConfiglayout);
router.delete('/:config_code/fields/:key/delete', deleteFieldFromLayout);

module.exports = router;
