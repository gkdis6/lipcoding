const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * 사용자 회원가입
 * POST /api/signup
 */
async function signup(req, res) {
  try {
    const { email, password, name, role, bio, skills, experience_years, hourly_rate } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already exists'
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
      bio: bio || '',
      skills: skills || '',
      experience_years: experience_years || 0,
      hourly_rate: hourly_rate || null
    };

    const userId = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        name,
        role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    });
  }
}

/**
 * 사용자 로그인
 * POST /api/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 사용자 조회
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // 비밀번호 검증
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed'
    });
  }
}

module.exports = {
  signup,
  login
};
