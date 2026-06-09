const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { formSchema } = require('../validations/form.validation');
const { getFormLayout, getAllDetails, enterDetails, getEmployeeDetails } = require('../controllers/formController');

router.get('/all', getAllDetails);
router.get('/:client_code/layout', getFormLayout);
router.get('/:employee_code/details', getEmployeeDetails);
router.post('/:client_code/fill-form', validator(formSchema), enterDetails);

module.exports = router;
