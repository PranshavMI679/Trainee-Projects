const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const configValidation = require('../middleware/configValidation');
const { createSubmission } = require('../validations/form_data.validation');
const { getModuleLayout, getCombinedFormLayout, getEmployeeCombinedDetails, processCombinedFormDetails } = require('../controllers/formController');

router.get('/employee/:employee_code/details', getEmployeeCombinedDetails);
router.get('/layout/:client_code', getCombinedFormLayout);
router.get('/layout/module/:module_code', getModuleLayout);

router.post('/process', validator(createSubmission), configValidation, processCombinedFormDetails);

module.exports = router;