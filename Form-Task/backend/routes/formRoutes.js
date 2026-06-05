const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { formSchema } = require('../validations/form.validations');
const { showFormLayout, employeeForm, showEmployeeDetails } = require('../controllers/formController');

router.get('/:client_code/form-layout', showFormLayout);
router.post('/:client_code/employee', validator(formSchema), employeeForm);
router.get('/:employee_code/details', showEmployeeDetails);

module.exports = router;
