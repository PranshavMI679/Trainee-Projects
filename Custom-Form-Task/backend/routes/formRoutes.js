const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { formSchema } = require('../validations/form.validation');
const configValidation =  require('../middleware/configValidation');
const { getFormLayout, getAllDetails, enterDetails, getEmployeeDetails } = require('../controllers/formController');

router.get('/all', getAllDetails);
router.get('/:client_code/layout', getFormLayout);
router.get('/:employee_code/details', getEmployeeDetails);
router.post('/:config_code/fill-form', validator(formSchema), configValidation, enterDetails);

module.exports = router;
