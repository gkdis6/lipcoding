const jwt = require('jsonwebtoken');

// JWT 시크릿 키 (실제 환경에서는 환경변수로 관리)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * JWT 토큰 생성
 * @param {object} payload - 토큰에 포함할 페이로드
 * @returns {string} JWT 토큰
 */
function generateToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  
  const tokenPayload = {
    // RFC 7519 필수 클레임
    iss: 'mentor-mentee-app',           // issuer
    sub: payload.userId.toString(),     // subject  
    aud: 'mentor-mentee-users',         // audience
    exp: now + (24 * 60 * 60),         // expiration time (24시간)
    nbf: now,                          // not before
    iat: now,                          // issued at
    jti: `${payload.userId}-${now}`,   // JWT ID
    
    // 커스텀 클레임
    name: payload.name || '',
    email: payload.email,
    role: payload.role
  };
  
  return jwt.sign(tokenPayload, JWT_SECRET);
}

/**
 * JWT 토큰 검증
 * @param {string} token - 검증할 토큰
 * @returns {object} 디코딩된 페이로드
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * JWT 토큰에서 페이로드 추출 (검증 없이)
 * @param {string} token - 추출할 토큰
 * @returns {object} 디코딩된 페이로드
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
