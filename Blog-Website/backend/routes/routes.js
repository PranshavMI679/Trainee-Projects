const express = require('express');
const router = express.Router();

const auth = require('./authRoutes');
router.use('/auth', auth);

const admin = require('./adminRoutes');
router.use('/admin', admin);

const category = require('./categoryRoutes');
router.use('/category', category);

const comment = require('./commentRoutes');
router.use('/comment', comment);

const user = require('./userRoutes');
router.use('/user', user);

const reaction = require('./reactionRoutes');
router.use('/reaction', reaction);

const interest = require('./interestRoutes');
router.use('/interest', interest);

const following = require('./followingRoutes');
router.use('/follow', following);

const notify = require('./notificationRoutes');
router.use('/notify', notify);

const blog = require('./writeRoutes');
router.use('/blog', blog);

module.exports = router;