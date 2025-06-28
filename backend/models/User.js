const database = require('./database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password_hash; // 데이터베이스의 password_hash 컬럼
    this.role = data.role;
    this.name = data.name;
    this.bio = data.bio;
    this.skills = data.skills;
    this.experience_years = data.experience_years;
    this.hourly_rate = data.hourly_rate;
    this.profile_image = data.profile_image;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // 새 사용자 생성
  static async create(userData) {
    const { 
      email, 
      password, 
      name, 
      role, 
      bio = '', 
      skills = '', 
      experience_years = 0, 
      hourly_rate = null 
    } = userData;
    
    const sql = `
      INSERT INTO users (email, password_hash, name, role, bio, skills, experience_years, hourly_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await database.run(sql, [
        email, 
        password, 
        name, 
        role, 
        bio, 
        skills, 
        experience_years, 
        hourly_rate
      ]);
      return result.lastID;
    } catch (error) {
      throw error;
    }
  }

  // ID로 사용자 찾기
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    try {
      const row = await database.get(sql, [id]);
      return row ? new User(row) : null;
    } catch (error) {
      throw error;
    }
  }

  // 이메일로 사용자 찾기
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    try {
      const row = await database.get(sql, [email]);
      return row ? new User(row) : null;
    } catch (error) {
      throw error;
    }
  }

  // 프로필 업데이트
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    // 업데이트할 필드들
    const allowedFields = ['name', 'bio', 'skills', 'experience_years', 'hourly_rate', 'profile_image'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    
    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    try {
      await database.run(sql, values);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 멘토 검색 (필터링 및 정렬)
  static async findMentors(filters = {}, options = {}) {
    let sql = 'SELECT * FROM users WHERE role = ?';
    let params = ['mentor'];
    
    // 스킬 필터
    if (filters.skills) {
      sql += ' AND skills LIKE ?';
      params.push(`%${filters.skills}%`);
    }
    
    // 경험 연수 필터
    if (filters.min_experience !== undefined) {
      sql += ' AND experience_years >= ?';
      params.push(filters.min_experience);
    }
    
    if (filters.max_experience !== undefined) {
      sql += ' AND experience_years <= ?';
      params.push(filters.max_experience);
    }
    
    // 시간당 요금 필터
    if (filters.min_rate !== undefined) {
      sql += ' AND hourly_rate >= ?';
      params.push(filters.min_rate);
    }
    
    if (filters.max_rate !== undefined) {
      sql += ' AND hourly_rate <= ?';
      params.push(filters.max_rate);
    }
    
    // 정렬
    const { sortBy = 'created_at', order = 'desc' } = options;
    sql += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
    
    // 페이지네이션
    if (options.limit) {
      const offset = ((options.page || 1) - 1) * options.limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(options.limit, offset);
    }
    
    try {
      const rows = await database.all(sql, params);
      return rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // 멘토 개수 세기 (필터링 적용)
  static async countMentors(filters = {}) {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE role = ?';
    let params = ['mentor'];
    
    // 스킬 필터
    if (filters.skills) {
      sql += ' AND skills LIKE ?';
      params.push(`%${filters.skills}%`);
    }
    
    // 경험 연수 필터
    if (filters.min_experience !== undefined) {
      sql += ' AND experience_years >= ?';
      params.push(filters.min_experience);
    }
    
    if (filters.max_experience !== undefined) {
      sql += ' AND experience_years <= ?';
      params.push(filters.max_experience);
    }
    
    // 시간당 요금 필터
    if (filters.min_rate !== undefined) {
      sql += ' AND hourly_rate >= ?';
      params.push(filters.min_rate);
    }
    
    if (filters.max_rate !== undefined) {
      sql += ' AND hourly_rate <= ?';
      params.push(filters.max_rate);
    }
    
    try {
      const result = await database.get(sql, params);
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  // JSON 변환 (비밀번호 제외)
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    
    return {
      ...userWithoutPassword,
      profile_image_url: this.getProfileImageUrl()
    };
  }

  // 프로필 이미지 URL 생성
  getProfileImageUrl() {
    if (this.profile_image) {
      return `/api/images/${this.role}/${this.id}`;
    }
    return null;
  }
}

module.exports = User;
