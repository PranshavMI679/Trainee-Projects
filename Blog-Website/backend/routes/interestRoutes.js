const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { saveInterestsSchema } = require('../validations/interest.validation');
const { saveInterests, forYouFeed } = require('../controllers/interestController');

router.use(authMiddleware);

router.post('/save', validator(saveInterestsSchema), saveInterests);
router.get('/for-you', forYouFeed);

module.exports = router;
