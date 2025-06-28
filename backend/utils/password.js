const bcrypt = require('bcryptjs');

/**
 * 비밀번호 해싱
 * @param {string} password - 해싱할 비밀번호
 * @returns {Promise<string>} 해싱된 비밀번호
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * 비밀번호 검증
 * @param {string} password - 검증할 비밀번호
 * @param {string} hashedPassword - 해싱된 비밀번호
 * @returns {Promise<boolean>} 검증 결과
 */
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
};
