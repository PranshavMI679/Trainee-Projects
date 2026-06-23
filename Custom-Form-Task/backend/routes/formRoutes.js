const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const configValidation = require('../middleware/configValidation');
const { formSchema } = require('../validations/form.validation');
const { getFormLayout, getAllDetails, getEmployeeDetails, processFormDetails } = require('../controllers/formController');

router.get('/:module_code/all', getAllDetails);
router.get('/:module_code/layout', getFormLayout);
router.get('/:employee_code/details', getEmployeeDetails);

router.post('/:code/process', validator(formSchema), configValidation, processFormDetails);

module.exports = router;
