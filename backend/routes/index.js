const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const badgeRoutes = require('./badgeRoutes');
const userBadgeRoutes = require('./userBadgeRoutes');

router.use('/users', userRoutes);
router.use('/badges', badgeRoutes);

module.exports = router;