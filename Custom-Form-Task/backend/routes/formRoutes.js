const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const configValidation = require('../middleware/configValidation');
const { formSchema } = require('../validations/form.validation');
const { getFormLayout, getAllDetails, getEmployeeDetails, processFormDetails} = require('../controllers/formController');

router.get('/all', getAllDetails);
router.get('/:client_code/layout', getFormLayout);
router.get('/:employee_code/details', getEmployeeDetails);

//router.post('/:code/process', validator(formSchema), configValidation, processFormDetails);
router.post('/:code/process', configValidation, processFormDetails);

module.exports = router;

/*
const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const configValidation = require('../middleware/configValidation');
const { formSchema } = require('../validations/form.validation');
const { 
  getFormLayout, 
  getAllDetails, 
  getEmployeeDetails, 
  processFormDetails 
} = require('../controllers/formController');

// 1. Fetch all record submissions belonging strictly to a single dynamic module
router.get('/:module_code/all', getAllDetails);

// 2. Fetch the unpopulated UI entry layout configuration for a specific dynamic module
router.get('/:module_code/layout', getFormLayout);

// 3. Fetch the full configuration layout with values filled in for a specific record row
router.get('/:module_code/:employee_code/details', getEmployeeDetails);

// 4. Universal Form Data Submission Engine Entry Point
// Fork path A: New submissions pass only the :module_code
// Fork path B: Profile updates pass the unique :employee_code record row identifier
router.post('/:module_code/:employee_code?', validator(formSchema), configValidation, processFormDetails);

module.exports = router;

*/ 