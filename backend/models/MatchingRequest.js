const database = require('./database');

class MatchingRequest {
  constructor(data) {
    this.id = data.id;
    this.mentee_id = data.mentee_id;
    this.mentor_id = data.mentor_id;
    this.message = data.message;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // JOIN된 사용자 정보가 있는 경우
    this.mentee_name = data.mentee_name;
    this.mentee_email = data.mentee_email;
    this.mentor_name = data.mentor_name;
    this.mentor_email = data.mentor_email;
  }

  // 새 매칭 요청 생성
  static async create(requestData) {
    const { mentee_id, mentor_id, message, status = 'pending' } = requestData;
    
    const sql = `
      INSERT INTO matching_requests (mentee_id, mentor_id, message, status)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const result = await database.run(sql, [mentee_id, mentor_id, message, status]);
      return result.lastID;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Match request already exists for this mentor');
      }
      throw error;
    }
  }

  // ID로 매칭 요청 찾기
  static async findById(id) {
    const sql = `
      SELECT mr.*, 
             mentee.name as mentee_name, mentee.email as mentee_email,
             mentor.name as mentor_name, mentor.email as mentor_email
      FROM matching_requests mr
      LEFT JOIN users mentee ON mr.mentee_id = mentee.id
      LEFT JOIN users mentor ON mr.mentor_id = mentor.id
      WHERE mr.id = ?
    `;
    
    try {
      const row = await database.get(sql, [id]);
      return row ? new MatchingRequest(row) : null;
    } catch (error) {
      throw error;
    }
  }

  // 멘토와 멘티 간 기존 요청 찾기
  static async findByMentorAndMentee(mentorId, menteeId) {
    const sql = 'SELECT * FROM matching_requests WHERE mentor_id = ? AND mentee_id = ?';
    
    try {
      const row = await database.get(sql, [mentorId, menteeId]);
      return row ? new MatchingRequest(row) : null;
    } catch (error) {
      throw error;
    }
  }

  // 멘토가 받은 요청 목록 조회
  static async findByMentor(mentorId, options = {}) {
    let sql = `
      SELECT mr.*, 
             mentee.name as mentee_name, mentee.email as mentee_email
      FROM matching_requests mr
      JOIN users mentee ON mr.mentee_id = mentee.id
      WHERE mr.mentor_id = ?
    `;
    let params = [mentorId];
    
    // 상태 필터
    if (options.status) {
      sql += ' AND mr.status = ?';
      params.push(options.status);
    }
    
    sql += ' ORDER BY mr.created_at DESC';
    
    // 페이지네이션
    if (options.limit) {
      const offset = ((options.page || 1) - 1) * options.limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(options.limit, offset);
    }
    
    try {
      const rows = await database.all(sql, params);
      return rows.map(row => new MatchingRequest(row));
    } catch (error) {
      throw error;
    }
  }

  // 멘티가 보낸 요청 목록 조회
  static async findByMentee(menteeId, options = {}) {
    let sql = `
      SELECT mr.*, 
             mentor.name as mentor_name, mentor.email as mentor_email
      FROM matching_requests mr
      JOIN users mentor ON mr.mentor_id = mentor.id
      WHERE mr.mentee_id = ?
    `;
    let params = [menteeId];
    
    // 상태 필터
    if (options.status) {
      sql += ' AND mr.status = ?';
      params.push(options.status);
    }
    
    sql += ' ORDER BY mr.created_at DESC';
    
    // 페이지네이션
    if (options.limit) {
      const offset = ((options.page || 1) - 1) * options.limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(options.limit, offset);
    }
    
    try {
      const rows = await database.all(sql, params);
      return rows.map(row => new MatchingRequest(row));
    } catch (error) {
      throw error;
    }
  }

  // 멘토별 요청 개수 세기
  static async countByMentor(mentorId, status = null) {
    let sql = 'SELECT COUNT(*) as count FROM matching_requests WHERE mentor_id = ?';
    let params = [mentorId];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    try {
      const result = await database.get(sql, params);
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  // 멘티별 요청 개수 세기
  static async countByMentee(menteeId, status = null) {
    let sql = 'SELECT COUNT(*) as count FROM matching_requests WHERE mentee_id = ?';
    let params = [menteeId];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    try {
      const result = await database.get(sql, params);
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  // 요청 상태 업데이트
  static async updateStatus(id, newStatus) {
    const validStatuses = ['pending', 'accepted', 'rejected'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status value');
    }
    
    const sql = `
      UPDATE matching_requests 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      await database.run(sql, [newStatus, id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 요청 삭제
  static async delete(id) {
    const sql = 'DELETE FROM matching_requests WHERE id = ?';
    
    try {
      await database.run(sql, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // JSON 변환
  toJSON() {
    return {
      id: this.id,
      mentor_id: this.mentor_id,
      mentee_id: this.mentee_id,
      message: this.message,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      mentee_name: this.mentee_name,
      mentee_email: this.mentee_email,
      mentor_name: this.mentor_name,
      mentor_email: this.mentor_email
    };
  }
}

module.exports = MatchingRequest;

module.exports = MatchingRequest;
