const express = require('express');
const router = express.Router();

const { getCurrentUser, updateProfile, getProfileImage } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
const { validateRequest, profileUpdateSchema } = require('../utils/validation');

// 현재 사용자 정보 조회
router.get('/me', authenticateToken, getCurrentUser);

// 프로필 업데이트 (이미지 포함)
router.put('/profile', 
  authenticateToken, 
  uploadProfileImage, 
  validateRequest(profileUpdateSchema), 
  updateProfile
);

// 프로필 이미지 조회
router.get('/images/:role/:id', getProfileImage);

module.exports = router;
