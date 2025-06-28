const MatchingRequest = require('../models/MatchingRequest');
const User = require('../models/User');

/**
 * 매칭 요청 생성
 * POST /api/match-requests
 */
async function createMatchRequest(req, res) {
  try {
    const { mentor_id, message } = req.body;
    const mentee_id = req.user.id;

    // 멘티만 매칭 요청 가능
    if (req.user.role !== 'mentee') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only mentees can create match requests'
      });
    }

    // 멘토 존재 확인
    const mentor = await User.findById(mentor_id);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Mentor not found'
      });
    }

    // 이미 요청이 있는지 확인
    const existingRequest = await MatchingRequest.findByMentorAndMentee(mentor_id, mentee_id);
    if (existingRequest) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Match request already exists'
      });
    }

    // 매칭 요청 생성
    const requestData = {
      mentor_id,
      mentee_id,
      message: message || '',
      status: 'pending'
    };

    const requestId = await MatchingRequest.create(requestData);

    res.status(201).json({
      message: 'Match request created successfully',
      request_id: requestId
    });

  } catch (error) {
    console.error('Create match request error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create match request'
    });
  }
}

/**
 * 매칭 요청 목록 조회
 * GET /api/match-requests
 */
async function getMatchRequests(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid pagination parameters'
      });
    }

    // 상태 필터 검증
    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status parameter'
      });
    }

    // 역할에 따른 매칭 요청 조회
    let requests;
    let totalCount;

    if (userRole === 'mentor') {
      requests = await MatchingRequest.findByMentor(userId, {
        status,
        page: pageNum,
        limit: limitNum
      });
      totalCount = await MatchingRequest.countByMentor(userId, status);
    } else {
      requests = await MatchingRequest.findByMentee(userId, {
        status,
        page: pageNum,
        limit: limitNum
      });
      totalCount = await MatchingRequest.countByMentee(userId, status);
    }

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      requests,
      pagination: {
        current_page: pageNum,
        total_pages: totalPages,
        total_count: totalCount,
        limit: limitNum,
        has_next: pageNum < totalPages,
        has_prev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get match requests error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve match requests'
    });
  }
}

/**
 * 매칭 요청 상태 업데이트 (수락/거절)
 * PUT /api/match-requests/:id
 */
async function updateMatchRequestStatus(req, res) {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    // 멘토만 상태 변경 가능
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only mentors can update match request status'
      });
    }

    // 매칭 요청 조회
    const matchRequest = await MatchingRequest.findById(requestId);
    if (!matchRequest) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Match request not found'
      });
    }

    // 권한 확인 (해당 멘토만 상태 변경 가능)
    if (matchRequest.mentor_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own match requests'
      });
    }

    // 이미 처리된 요청인지 확인
    if (matchRequest.status !== 'pending') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Match request has already been processed'
      });
    }

    // 상태 업데이트
    await MatchingRequest.updateStatus(requestId, status);

    res.status(200).json({
      message: `Match request ${status} successfully`
    });

  } catch (error) {
    console.error('Update match request status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update match request status'
    });
  }
}

/**
 * 매칭 요청 삭제
 * DELETE /api/match-requests/:id
 */
async function deleteMatchRequest(req, res) {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    // 매칭 요청 조회
    const matchRequest = await MatchingRequest.findById(requestId);
    if (!matchRequest) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Match request not found'
      });
    }

    // 권한 확인 (멘티는 자신의 요청만, 멘토는 자신에게 온 요청만 삭제 가능)
    const canDelete = 
      (req.user.role === 'mentee' && matchRequest.mentee_id === userId) ||
      (req.user.role === 'mentor' && matchRequest.mentor_id === userId);

    if (!canDelete) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own match requests'
      });
    }

    // 매칭 요청 삭제
    await MatchingRequest.delete(requestId);

    res.status(200).json({
      message: 'Match request deleted successfully'
    });

  } catch (error) {
    console.error('Delete match request error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete match request'
    });
  }
}

module.exports = {
  createMatchRequest,
  getMatchRequests,
  updateMatchRequestStatus,
  deleteMatchRequest
};
