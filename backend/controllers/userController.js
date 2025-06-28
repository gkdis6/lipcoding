const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

/**
 * 현재 사용자 정보 조회
 * GET /api/me
 */
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // 비밀번호 제외하고 응답
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      experience_years: user.experience_years,
      hourly_rate: user.hourly_rate,
      profile_image: user.profile_image,
      created_at: user.created_at
    };

    res.status(200).json(userResponse);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user information'
    });
  }
}

/**
 * 프로필 정보 업데이트
 * PUT /api/profile
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, bio, skills, experience_years, hourly_rate } = req.body;

    // 업데이트할 데이터 준비
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (experience_years !== undefined) updateData.experience_years = experience_years;
    if (hourly_rate !== undefined) updateData.hourly_rate = hourly_rate;

    // 프로필 이미지 처리
    if (req.file) {
      updateData.profile_image = `/uploads/profiles/${req.file.filename}`;
    }

    // 프로필 업데이트
    await User.update(userId, updateData);

    // 업데이트된 사용자 정보 조회
    const updatedUser = await User.findById(userId);

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      experience_years: updatedUser.experience_years,
      hourly_rate: updatedUser.hourly_rate,
      profile_image: updatedUser.profile_image,
      created_at: updatedUser.created_at
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile'
    });
  }
}

/**
 * 프로필 이미지 조회
 * GET /api/images/:role/:id
 */
async function getProfileImage(req, res) {
  try {
    const { role, id } = req.params;

    // 역할 검증
    if (!['mentor', 'mentee'].includes(role)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid role parameter'
      });
    }

    // 사용자 조회
    const user = await User.findById(id);
    if (!user || user.role !== role) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // 프로필 이미지가 없는 경우 기본 이미지 반환
    if (!user.profile_image) {
      const defaultImagePath = path.join(__dirname, '..', 'assets', 'default-profile.png');
      try {
        await fs.access(defaultImagePath);
        return res.sendFile(defaultImagePath);
      } catch (err) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Profile image not found'
        });
      }
    }

    // 프로필 이미지 파일 경로
    const imagePath = path.join(__dirname, '..', user.profile_image.replace('/uploads/', 'uploads/'));

    try {
      await fs.access(imagePath);
      res.sendFile(imagePath);
    } catch (err) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Profile image not found'
      });
    }

  } catch (error) {
    console.error('Get profile image error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve profile image'
    });
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
  getProfileImage
};
