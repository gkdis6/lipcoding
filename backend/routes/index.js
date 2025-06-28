const express = require('express');
const router = express.Router();

// 각 라우트 모듈 가져오기
const authRoutes = require('./auth');
const userRoutes = require('./users');
const mentorRoutes = require('./mentors');
const matchRequestRoutes = require('./matchRequests');

// 라우트 등록
router.use('/', authRoutes);           // /api/signup, /api/login
router.use('/', userRoutes);           // /api/me, /api/profile, /api/images
router.use('/mentors', mentorRoutes);  // /api/mentors
router.use('/match-requests', matchRequestRoutes); // /api/match-requests

module.exports = router;
