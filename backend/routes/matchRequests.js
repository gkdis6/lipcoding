const express = require('express');
const router = express.Router();

const { 
  createMatchRequest, 
  getMatchRequests, 
  updateMatchRequestStatus, 
  deleteMatchRequest 
} = require('../controllers/matchRequestController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, matchRequestSchema, matchRequestStatusSchema } = require('../utils/validation');

// 매칭 요청 생성
router.post('/', authenticateToken, validateRequest(matchRequestSchema), createMatchRequest);

// 매칭 요청 목록 조회
router.get('/', authenticateToken, getMatchRequests);

// 매칭 요청 상태 업데이트 (수락/거절)
router.put('/:id', authenticateToken, validateRequest(matchRequestStatusSchema), updateMatchRequestStatus);

// 매칭 요청 삭제
router.delete('/:id', authenticateToken, deleteMatchRequest);

module.exports = router;
