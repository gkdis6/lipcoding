const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 확인하고 사용자 정보를 req.user에 저장
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required'
      });
    }

    // 토큰 검증
    const decoded = verifyToken(token);
    
    // 사용자 정보 조회 (sub 클레임에서 사용자 ID 추출)
    const userId = decoded.sub;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token: user not found'
      });
    }

    // 요청 객체에 사용자 정보 저장
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication failed'
      });
    }
  }
}

/**
 * 특정 역할 인증 미들웨어
 * @param {...string} roles - 허용할 역할들
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
