const Joi = require('joi');

// 사용자 회원가입 스키마
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  name: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid('mentor', 'mentee').required(),
  bio: Joi.string().max(1000).allow('').optional(),
  skills: Joi.string().max(500).allow('').optional(),
  experience_years: Joi.number().integer().min(0).max(50).optional(),
  hourly_rate: Joi.number().min(0).max(10000).optional()
});

// 사용자 로그인 스키마
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// 프로필 업데이트 스키마
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  bio: Joi.string().max(1000).allow('').optional(),
  skills: Joi.string().max(500).allow('').optional(),
  experience_years: Joi.number().integer().min(0).max(50).optional(),
  hourly_rate: Joi.number().min(0).max(10000).optional()
});

// 매칭 요청 생성 스키마
const matchRequestSchema = Joi.object({
  mentor_id: Joi.number().integer().positive().required(),
  message: Joi.string().max(1000).allow('').optional()
});

// 매칭 요청 상태 업데이트 스키마
const matchRequestStatusSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required()
});

/**
 * 요청 데이터 검증 미들웨어
 * @param {object} schema - Joi 스키마
 * @returns {Function} Express 미들웨어
 */
function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }
    
    req.body = value;
    next();
  };
}

/**
 * 쿼리 파라미터 검증
 * @param {object} schema - Joi 스키마
 * @returns {Function} Express 미들웨어
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }
    
    req.query = value;
    next();
  };
}

module.exports = {
  signupSchema,
  loginSchema,
  profileUpdateSchema,
  matchRequestSchema,
  matchRequestStatusSchema,
  validateRequest,
  validateQuery
};
