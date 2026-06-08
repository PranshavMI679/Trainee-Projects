const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { formSchema } = require('../validations/form.validation');
const { getAllDetails, enterDetails } = require('../controllers/formController');

router.get('/:', getAllDetails);
router.post('/enter', validator(formSchema), enterDetails);

module.exports = router;
