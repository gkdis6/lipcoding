const express = require('express');
const router = express.Router();

const { getMentors } = require('../controllers/mentorController');
const { authenticateToken } = require('../middleware/auth');

// 멘토 목록 조회 (필터링 및 정렬 지원)
router.get('/', authenticateToken, getMentors);

module.exports = router;
