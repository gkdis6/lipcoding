const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');
const { validateRequest, signupSchema, loginSchema } = require('../utils/validation');

// 회원가입
router.post('/signup', validateRequest(signupSchema), signup);

// 로그인
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;
