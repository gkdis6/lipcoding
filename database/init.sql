-- 멘토-멘티 매칭 앱 데이터베이스 초기화 스크립트

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('mentor', 'mentee')),
    name VARCHAR(100),
    bio TEXT,
    skills TEXT, -- 기술 스택 (멘토/멘티 모두)
    experience_years INTEGER DEFAULT 0, -- 경험 연수
    hourly_rate DECIMAL(10,2), -- 시간당 요금 (멘토만)
    profile_image VARCHAR(255), -- 프로필 이미지 경로
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- matching_requests 테이블 생성
CREATE TABLE IF NOT EXISTS matching_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mentee_id INTEGER NOT NULL,
    mentor_id INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(mentee_id, mentor_id) -- 같은 멘토에게 중복 요청 방지
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_matching_requests_mentor ON matching_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_matching_requests_mentee ON matching_requests(mentee_id);
CREATE INDEX IF NOT EXISTS idx_matching_requests_status ON matching_requests(status);

-- 테스트용 샘플 데이터 삽입
-- 비밀번호는 bcrypt로 해싱된 "password123"
INSERT OR IGNORE INTO users (id, email, password_hash, role, name, bio, skills, experience_years, hourly_rate) VALUES 
(1, 'user@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentor', '김멘토', 'React 전문 개발자입니다. 테스트용 계정입니다.', 'React, JavaScript, TypeScript, Node.js', 5, 60000),
(2, 'mentor1@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentor', '이멘토', 'React 전문 개발자입니다. 3년 경력으로 다양한 프로젝트 경험이 있습니다.', 'React, JavaScript, TypeScript, Node.js', 3, 50000),
(3, 'mentor2@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentor', '이지은', 'Vue.js와 Python을 다루는 풀스택 개발자입니다.', 'Vue.js, Python, Django, PostgreSQL', 4, 60000),
(4, 'mentor3@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentor', '박철수', 'Node.js 백엔드 전문가입니다. 5년 경력의 시니어 개발자입니다.', 'Node.js, Express, MongoDB, AWS', 5, 70000),
(5, 'mentee1@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentee', '정멘티', 'React를 배우고 싶은 초보 개발자입니다.', 'HTML, CSS, JavaScript', 0, NULL),
(6, 'mentee2@example.com', '$2b$10$cfl90y0nkOloc9tfDNck2uPhSIDGVlVfQRAVCSzvHyN.nG/k2kXly', 'mentee', '최지민', 'Python과 데이터 분석에 관심이 많은 학생입니다.', 'Python, pandas', 1, NULL);

-- 테스트용 매칭 요청 데이터
INSERT OR IGNORE INTO matching_requests (id, mentee_id, mentor_id, message, status) VALUES 
(1, 5, 1, 'React 멘토링을 받고 싶습니다. 테스트용 요청입니다.', 'pending'),
(2, 5, 2, 'React 멘토링을 받고 싶습니다. 초보자도 괜찮을까요?', 'pending'),
(3, 6, 3, 'Python 백엔드 개발을 배우고 싶어요!', 'accepted'),
(4, 5, 4, 'Node.js에 대해 배우고 싶습니다.', 'rejected');

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_matching_requests_timestamp 
    AFTER UPDATE ON matching_requests
BEGIN
    UPDATE matching_requests SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
