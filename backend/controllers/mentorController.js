const User = require('../models/User');

/**
 * 멘토 목록 조회 (필터링 및 정렬 지원)
 * GET /api/mentors
 */
async function getMentors(req, res) {
  try {
    const {
      skills,
      min_experience,
      max_experience,
      min_rate,
      max_rate,
      sort_by = 'created_at',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // 쿼리 파라미터 검증
    const validSortFields = ['created_at', 'experience_years', 'hourly_rate', 'name'];
    const validOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sort_by)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid sort_by parameter'
      });
    }

    if (!validOrders.includes(order)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid order parameter'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid pagination parameters'
      });
    }

    // 필터 조건 구성
    const filters = {
      role: 'mentor'
    };

    if (skills) {
      filters.skills = skills;
    }

    if (min_experience !== undefined) {
      filters.min_experience = parseInt(min_experience);
    }

    if (max_experience !== undefined) {
      filters.max_experience = parseInt(max_experience);
    }

    if (min_rate !== undefined) {
      filters.min_rate = parseFloat(min_rate);
    }

    if (max_rate !== undefined) {
      filters.max_rate = parseFloat(max_rate);
    }

    // 멘토 목록 조회
    const mentors = await User.findMentors(filters, {
      sortBy: sort_by,
      order: order,
      page: pageNum,
      limit: limitNum
    });

    // 총 개수 조회 (페이지네이션용)
    const totalCount = await User.countMentors(filters);

    // 응답 데이터 구성 (비밀번호 제외)
    const mentorList = mentors.map(mentor => ({
      id: mentor.id,
      name: mentor.name,
      bio: mentor.bio,
      skills: mentor.skills,
      experience_years: mentor.experience_years,
      hourly_rate: mentor.hourly_rate,
      profile_image: mentor.profile_image,
      created_at: mentor.created_at
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      mentors: mentorList,
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
    console.error('Get mentors error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve mentors'
    });
  }
}

module.exports = {
  getMentors
};
