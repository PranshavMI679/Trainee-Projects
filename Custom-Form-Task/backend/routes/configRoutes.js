const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { configSchema, editFieldSchema, layoutReorderSchema } = require('../validations/config.validation');
const { getClientLayout, processConfigLayout, deleteFieldFromLayout, updateFormLayoutStructure } = require('../controllers/configController');

router.get('/:client_code/client-layout', getClientLayout);

router.post('/:identifier/process', validator(configSchema), processConfigLayout);

router.patch('/:config_code/reorder', validator(layoutReorderSchema), updateFormLayoutStructure);

//router.delete('/:config_code/fields/:key/delete', deleteFieldFromLayout);
router.delete('/:config_code/delete', deleteFieldFromLayout);


module.exports = router;
