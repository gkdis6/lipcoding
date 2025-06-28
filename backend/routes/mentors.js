const express = require('express');
const router = express.Router();

const { getMentors } = require('../controllers/mentorController');
const { authenticateToken } = require('../middleware/auth');

// 멘토 목록 조회 (인증 필요)
router.get('/', authenticateToken, getMentors);

module.exports = router;
