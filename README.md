# 멘토-멘티 매칭 앱

멘토와 멘티를 서로 매칭하는 웹 애플리케이션입니다. 멘토는 자신의 기술 스택과 소개를 등록하고, 멘티는 원하는 멘토에게 매칭 요청을 보낼 수 있습니다.

## 📋 프로젝트 개요

이 앱은 멘토와 멘티 간의 효율적인 매칭을 위한 플랫폼을 제공합니다. 멘토는 매칭 요청을 수락하거나 거절할 수 있으며, 한 명의 멘토는 동시에 한 명의 멘티와만 매칭됩니다.

## 🚀 기술 스택

- **Frontend**: React.js (포트 3000)
- **Backend**: Node.js Express (포트 8080)
- **Database**: SQLite (로컬 실행)
- **Authentication**: JWT (JSON Web Token)
- **API Documentation**: OpenAPI 3.0 + Swagger UI

## 📁 프로젝트 구조

```
mentor-mentee-app/
├── frontend/                 # React.js 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── services/        # API 호출 서비스
│   │   ├── utils/           # 유틸리티 함수
│   │   ├── hooks/           # 커스텀 훅
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/                  # Node.js Express 백엔드 API 서버
│   ├── src/
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── models/          # 데이터 모델
│   │   ├── routes/          # 라우트 정의
│   │   ├── middleware/      # 미들웨어
│   │   ├── services/        # 비즈니스 로직
│   │   └── utils/           # 유틸리티 함수
│   ├── tests/               # 테스트 파일
│   ├── package.json         # Node.js 의존성
│   └── app.js               # 메인 애플리케이션
├── docs/                     # API 문서
│   ├── openapi.yaml         # OpenAPI 명세
│   ├── schemas/             # 스키마 정의
│   └── examples/            # API 예시
├── database/                 # 데이터베이스 관련
│   ├── init.sql             # 초기 스키마
│   ├── models.js            # Sequelize/Mongoose 모델
│   └── migrations/          # 마이그레이션 파일
└── README.md
```

## 🔧 설치 및 실행

### 사전 요구사항

- Node.js 18+ (프론트엔드 및 백엔드)
- npm 또는 yarn
- Git
- SQLite (내장됨)

### 빠른 시작 가이드

#### 1. 리포지토리 클론
```bash
git clone <your-repository-url>
cd mentor-mentee-app
```

#### 2. 백엔드 실행
```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 데이터베이스 초기화 (SQLite)
npm run init-db

# 서버 실행
npm start
```

백엔드 서버가 http://localhost:8080 에서 실행됩니다.

#### 3. 프론트엔드 실행
```bash
# 새 터미널에서 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드 앱이 http://localhost:3000 에서 실행됩니다.

### JavaScript/Node.js 실행 명령어

#### 백엔드 (Node.js Express)
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 프로덕션 모드 실행
npm start

# 또는 직접 실행
node app.js
```

#### 프론트엔드 (React.js)
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build

# 테스트 실행
npm test
```

### 데이터베이스 설정 (SQLite)

#### SQLite 설정
```bash
# SQLite는 별도 설치 불요 (Node.js sqlite3 패키지 사용)
# 데이터베이스 초기화
npm run init-db

# 또는 수동으로
node database/init.js
```

#### package.json 스크립트 예시
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "init-db": "node database/init.js",
    "test": "jest"
  }
}
```

## 🌐 페이지 라우팅

### 인증되지 않은 사용자
- `/` → 자동으로 `/login`으로 리디렉션
- `/login` → 로그인 페이지
- `/signup` → 회원가입 페이지

### 인증된 사용자
- `/` → 자동으로 `/profile`로 리디렉션
- `/profile` → 사용자 프로필 페이지

### 멘토 사용자 전용
- `/requests` → 받은 매칭 요청 목록

### 멘티 사용자 전용
- `/mentors` → 멘토 목록 및 검색
- `/requests` → 보낸 매칭 요청 목록

## 🌐 접속 URL

- **프론트엔드**: http://localhost:3000
- **백엔드**: http://localhost:8080
- **API 엔드포인트**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui
- **OpenAPI 문서**: http://localhost:8080/openapi.json

## 🔐 인증 및 보안

### JWT 토큰 구조

본 애플리케이션은 RFC 7519 표준을 준수하는 JWT 토큰을 사용합니다.

#### 필수 클레임
- `iss` (Issuer): 토큰 발급자
- `sub` (Subject): 사용자 식별자
- `aud` (Audience): 토큰 대상
- `exp` (Expiration Time): 만료 시간 (발급 후 1시간)
- `nbf` (Not Before): 토큰 유효 시작 시간
- `iat` (Issued At): 발급 시간
- `jti` (JWT ID): 토큰 고유 식별자

#### 커스텀 클레임
- `name`: 사용자 이름
- `email`: 사용자 이메일
- `role`: 사용자 역할 (`mentor` 또는 `mentee`)

### 보안 조치

- SQL 인젝션 방지: 준비된 구문(Prepared Statements) 사용
- XSS 방지: 입력값 검증 및 이스케이프 처리
- OWASP TOP 10 취약점 대응
- 입력값 유효성 검사 및 제한

## 👥 주요 기능

### 1. 회원가입 및 로그인
- 이메일, 비밀번호, 역할(멘토/멘티) 기반 회원가입
- JWT 토큰 기반 인증 시스템
- 자동 리디렉션 (인증 상태에 따른 페이지 이동)

### 2. 사용자 프로필 관리
- **멘토**: 이름, 소개글, 프로필 이미지, 기술 스택
- **멘티**: 이름, 소개글, 프로필 이미지
- 프로필 이미지 업로드 및 관리

### 3. 멘토 목록 조회
- 멘토 리스트 조회
- 기술 스택 필터링
- 이름/기술 스택 기준 정렬

### 4. 매칭 요청 시스템
- 멘티 → 멘토 매칭 요청
- 요청 메시지 포함 가능
- 중복 요청 방지

### 5. 요청 관리
- 멘토: 요청 수락/거절
- 멘티: 요청 상태 확인 및 취소
- 1:1 매칭 제한

## 📖 사용자 스토리

### 1. 회원가입

**AS a user,**
**I WANT to** navigate to the `/signup` page
**SO THAT** I can sign up the service.

**AS a user,**
**I WANT to** create an account using my email address, password and role (either mentor or mentee)
**SO THAT** I can sign up the service.

**AS a user,**
**I WANT to** be redirected to the `/` page after completing the sign-up process
**SO THAT** I can log-in to the service.

### 2. 로그인

**AS a user,**
**I WANT to** navigate to the `/` page
**SO THAT** I can be automatically redirected to the `/login` page, if I'm not authenticated.

**AS a user,**
**I WANT to** navigate to the `/` page
**SO THAT** I can be automatically redirected to the `/profile` page, if I'm authenticated.

**AS a user,**
**I WANT to** log-in to the service using my email address and password
**SO THAT** I can be redirected to the `/profile` page and receive a JWT token containing my details.

**AS a user having the mentor role,**
**I WANT to** see the navigation bar containing `/profile` and `/requests` after login.

**AS a user having the mentee role,**
**I WANT to** see the navigation bar containing `/profile`, `/mentors` and `/requests` after login.

### 3. 사용자 프로필

**AS a user having the mentor role,**
**I WANT to** register my profile data including name, bio, image and tech skillsets
**SO THAT** mentees can see my details.

**AS a user having the mentee role,**
**I WANT to** register my profile data including name, bio and image
**SO THAT** mentors can see my details.

**AS a user,**
**I WANT to** upload an image (.png or .jpg, max 1MB) from my local computer
**SO THAT** everyone can see my profile image.

### 4. 멘토 목록 조회

**AS a user having the mentee role,**
**I WANT to** navigate to the `/mentors` page and search mentors by tech skillsets
**SO THAT** I can see filtered and sorted mentor lists.

### 5. 매칭 요청

**AS a user having the mentee role,**
**I WANT to** send only one request to one mentor at a time with a message
**SO THAT** I can see the request status at the `/requests` page.

### 6. 매칭 요청 수락/거절

**AS a user having the mentor role,**
**I WANT to** navigate to the `/requests` page and accept or reject requests
**SO THAT** mentees can see updated request status.

**AS a user having the mentor role,**
**I WANT to** only accept one request from one mentee
**SO THAT** other requests are automatically rejected.

### 7. 매칭 요청 목록

**AS a user having the mentee role,**
**I WANT to** see request status and cancel pending requests
**SO THAT** I can manage my matching requests.

## 📷 프로필 이미지 요구사항

- **형식**: .jpg, .png만 허용
- **크기**: 정사각형 500x500 ~ 1000x1000 픽셀
- **용량**: 최대 1MB
- **기본 이미지**:
  - 멘토: https://placehold.co/500x500.jpg?text=MENTOR
  - 멘티: https://placehold.co/500x500.jpg?text=MENTEE

## 🗄️ 데이터베이스

### 테이블 구조

#### users 테이블
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('mentor', 'mentee')),
    name VARCHAR(100),
    bio TEXT,
    tech_stack TEXT, -- JSON 배열 형태로 저장 (멘토만)
    profile_image BLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### matching_requests 테이블
```sql
CREATE TABLE matching_requests (
    id INTEGER PRIMARY KEY,
    mentee_id INTEGER NOT NULL,
    mentor_id INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentee_id) REFERENCES users(id),
    FOREIGN KEY (mentor_id) REFERENCES users(id),
    UNIQUE(mentee_id, mentor_id) -- 같은 멘토에게 중복 요청 방지
);
```

### 데이터베이스 제약사항

1. **사용자 이메일**: 고유값 (UNIQUE)
2. **역할 제한**: 'mentor' 또는 'mentee'만 허용
3. **매칭 요청 상태**: 'pending', 'accepted', 'rejected', 'cancelled'만 허용
4. **중복 요청 방지**: 동일한 멘티가 동일한 멘토에게 중복 요청 불가
5. **외래키 제약**: 유효한 사용자 ID만 참조 가능

## 🔄 API 엔드포인트

> **기본 URL**: `http://localhost:8080/api`  
> **인증**: 모든 보호된 엔드포인트는 `Authorization: Bearer <token>` 헤더 필요  
> **Content-Type**: `application/json`

### 1. 인증 (Authentication)

#### 회원가입
```http
POST /signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "김멘토",
  "role": "mentor" // "mentor" or "mentee"
}
```
**응답**: `201 Created` | `400 Bad Request` | `500 Internal Server Error`

#### 로그인
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**응답**: 
```json
{
  "token": "JWT_TOKEN"
}
```

### 2. 사용자 정보

#### 내 정보 조회
```http
GET /me
Authorization: Bearer <token>
```
**응답**:
```json
// 멘토
{
  "id": 1,
  "email": "user@example.com",
  "role": "mentor",
  "profile": {
    "name": "Alice",
    "bio": "Frontend mentor",
    "imageUrl": "/images/mentor/1",
    "skills": ["React", "Vue"]
  }
}

// 멘티
{
  "id": 10,
  "email": "user@example.com",
  "role": "mentee",
  "profile": {
    "name": "Alice",
    "bio": "Frontend learner",
    "imageUrl": "/images/mentee/10"
  }
}
```

#### 프로필 이미지
```http
GET /images/:role/:id
Authorization: Bearer <token>
```
**응답**: 이미지 파일 렌더링

#### 프로필 수정
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

// 멘토
{
  "id": 1,
  "name": "Alice",
  "role": "mentor",
  "bio": "Frontend mentor",
  "image": "BASE64_ENCODED_STRING",
  "skills": ["React", "Vue"]
}

// 멘티
{
  "id": 21,
  "name": "Alice",
  "role": "mentee", 
  "bio": "Frontend mentee",
  "image": "BASE64_ENCODED_STRING"
}
```

### 3. 멘토 관리 (멘티 전용)

#### 멘토 목록 조회
```http
GET /mentors?skill=<skill_set>&order_by=<skill_or_name>
Authorization: Bearer <token>
```

**쿼리 파라미터**:
- `skill`: 기술 스택 필터링 (한 번에 하나만 검색 가능)
- `order_by`: 정렬 기준 (`skill` 또는 `name`, 기본값: `id`)

**응답**:
```json
[
  {
    "id": 3,
    "email": "user@example.com",
    "role": "mentor",
    "profile": {
      "name": "김앞단",
      "bio": "Frontend mentor",
      "imageUrl": "/images/mentor/3",
      "skills": ["React", "Vue"]
    }
  }
]
```

### 4. 매칭 요청

#### 매칭 요청 보내기 (멘티 전용)
```http
POST /match-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "mentorId": 3,
  "menteeId": 4,
  "message": "멘토링 받고 싶어요!"
}
```

#### 받은 요청 목록 (멘토 전용)
```http
GET /match-requests/incoming
Authorization: Bearer <token>
```

#### 보낸 요청 목록 (멘티 전용)
```http
GET /match-requests/outgoing
Authorization: Bearer <token>
```

#### 요청 수락 (멘토 전용)
```http
PUT /match-requests/:id/accept
Authorization: Bearer <token>
```

#### 요청 거절 (멘토 전용)
```http
PUT /match-requests/:id/reject
Authorization: Bearer <token>
```

#### 요청 삭제/취소 (멘티 전용)
```http
DELETE /match-requests/:id
Authorization: Bearer <token>
```

**매칭 요청 상태**:
- `pending`: 대기중
- `accepted`: 수락됨
- `rejected`: 거절됨
- `cancelled`: 취소됨

## 📁 OpenAPI 문서 파일

실제 프로젝트에서는 다음과 같은 OpenAPI 문서 파일을 생성해야 합니다:

### docs/openapi.yaml
```yaml
openapi: 3.0.1
info:
  title: Mentor-Mentee Matching API
  description: API for matching mentors and mentees in a mentoring platform
  version: 1.0.0
  contact:
    name: Mentor-Mentee Matching App
  license:
    name: MIT

servers:
  - url: http://localhost:8080/api
    description: Local development server

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from login endpoint
```

### 문서 구조
```
docs/
├── openapi.yaml          # 메인 OpenAPI 명세 파일
├── schemas/             # 스키마 정의 파일들
│   ├── user.yaml
│   ├── auth.yaml
│   └── match-request.yaml
└── examples/            # API 요청/응답 예시
    ├── signup.json
    ├── login.json
    └── match-request.json
```

### API 문서 생성 및 검증

#### OpenAPI 검증
```bash
# Swagger CLI 설치
npm install -g @apidevtools/swagger-cli

# OpenAPI 문서 검증
swagger-cli validate docs/openapi.yaml
```

#### 문서 생성
```bash
# Redoc으로 HTML 문서 생성
npx redoc-cli build docs/openapi.yaml --output docs/api-docs.html

# Swagger UI로 정적 HTML 생성
npx swagger-ui-dist-cli -f docs/openapi.yaml -d docs/swagger-ui
```
## 📊 OpenAPI 명세

### Swagger UI 접속
- **Swagger UI**: http://localhost:8080/swagger-ui
- **OpenAPI JSON**: http://localhost:8080/openapi.json
- **루트 URL**: http://localhost:8080 (자동으로 Swagger UI로 리디렉션)

### API 명세 정보
- **제목**: Mentor-Mentee Matching API
- **버전**: 1.0.0
- **라이선스**: MIT
- **기본 URL**: `http://localhost:8080/api`

### API 설계 원칙
1. **설계 우선 개발**: OpenAPI 명세를 먼저 작성한 후 구현
2. **RESTful 설계**: HTTP 메서드와 상태 코드를 의미에 맞게 사용
3. **일관된 응답 형식**: 모든 API는 JSON 형태로 응답
4. **명확한 에러 처리**: HTTP 상태 코드와 에러 메시지 제공
5. **JWT 인증**: Bearer 토큰을 통한 API 보안

### API 태그 분류
- **Authentication**: 사용자 인증 관련 엔드포인트
- **User Profile**: 사용자 프로필 관리 엔드포인트
- **Mentors**: 멘토 목록 조회 엔드포인트
- **Match Requests**: 매칭 요청 관리 엔드포인트

### 공통 스키마

#### 에러 응답 형식
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

#### JWT 인증
- **타입**: HTTP Bearer
- **형식**: JWT
- **헤더**: `Authorization: Bearer <token>`

### 주요 스키마 구조

#### 회원가입 요청 (SignupRequest)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "김멘토",
  "role": "mentor" // "mentor" or "mentee"
}
```

#### 로그인 응답 (LoginResponse)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 멘토 프로필 (MentorProfile)
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "mentor",
  "profile": {
    "name": "Alice",
    "bio": "Frontend mentor",
    "imageUrl": "/images/mentor/1",
    "skills": ["React", "Vue"]
  }
}
```

#### 멘티 프로필 (MenteeProfile)
```json
{
  "id": 10,
  "email": "user@example.com",
  "role": "mentee",
  "profile": {
    "name": "Alice",
    "bio": "Frontend mentee",
    "imageUrl": "/images/mentee/10"
  }
}
```

#### 매칭 요청 (MatchRequest)
```json
{
  "id": 1,
  "mentorId": 3,
  "menteeId": 4,
  "message": "멘토링 받고 싶어요!",
  "status": "pending" // "pending", "accepted", "rejected", "cancelled"
}
```

### HTTP 상태 코드
- `200 OK`: 성공적인 요청 처리
- `201 Created`: 리소스 생성 성공 (회원가입)
- `400 Bad Request`: 잘못된 요청 형식
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류

### 엔드포인트별 Operation ID
- `signup`: 회원가입
- `login`: 로그인
- `getCurrentUser`: 현재 사용자 정보 조회
- `updateProfile`: 프로필 업데이트
- `getProfileImage`: 프로필 이미지 조회
- `getMentors`: 멘토 목록 조회
- `createMatchRequest`: 매칭 요청 생성
- `getIncomingMatchRequests`: 받은 요청 목록
- `getOutgoingMatchRequests`: 보낸 요청 목록
- `acceptMatchRequest`: 요청 수락
- `rejectMatchRequest`: 요청 거절
- `cancelMatchRequest`: 요청 취소

## 🧪 테스트

### UI 테스트 요소 ID 규칙

테스트 자동화를 위해 다음과 같은 HTML 요소 ID를 사용해야 합니다:

#### 1. 회원가입 (`/signup`)
- 이메일 입력 필드: `id="email"`
- 비밀번호 입력 필드: `id="password"`
- 역할 선택 필드: `id="role"`
- 회원가입 버튼: `id="signup"`

#### 2. 로그인 (`/login`)
- 이메일 입력 필드: `id="email"`
- 비밀번호 입력 필드: `id="password"`
- 로그인 버튼: `id="login"`

#### 3. 사용자 프로필 (`/profile`)
- 이름 입력 필드: `id="name"`
- 소개글 입력 필드: `id="bio"`
- 기술 스택 입력 필드: `id="skillsets"`
- 프로필 사진 표시: `id="profile-photo"`
- 프로필 사진 업로드 필드: `id="profile"`
- 저장 버튼: `id="save"`

#### 4. 멘토 목록 (`/mentors`)
- 개별 멘토 요소: `class="mentor"`
- 검색 입력 필드: `id="search"`
- 이름 정렬 옵션: `id="name"`
- 기술 스택 정렬 옵션: `id="skill"`

#### 5. 매칭 요청
- 요청 메시지 입력: `id="message"`, `data-mentor-id="{{mentor-id}}"`, `data-testid="message-{{mentor-id}}"`
- 요청 상태 표시: `id="request-status"`
- 요청 버튼: `id="request"`

#### 6. 매칭 요청 관리 (`/requests`)
- 요청 메시지 표시: `class="request-message"`, `mentee="{{mentee-id}}"`
- 수락 버튼: `id="accept"`
- 거절 버튼: `id="reject"`

### 백엔드 테스트
```bash
cd backend
python -m pytest tests/
```

### 프론트엔드 테스트
```bash
cd frontend
npm test
```

### E2E 테스트
```bash
# Cypress 또는 Playwright 사용
npm run test:e2e
```

## 📝 개발 가이드라인

### 코딩 규칙
- REST API 설계 원칙 준수
- OpenAPI 3.0 명세 우선 개발
- 컴포넌트 기반 프론트엔드 개발
- 보안 베스트 프랙티스 적용

### Git 워크플로우
```bash
# 기능 브랜치 생성
git checkout -b feature/user-authentication

# 변경사항 커밋
git add .
git commit -m "feat: JWT 기반 사용자 인증 구현"

# 메인 브랜치에 병합
git checkout main
git merge feature/user-authentication
```

## 🎯 JavaScript 개발 가이드

### 권장 개발 환경
- **Node.js**: 18.x 이상
- **Package Manager**: npm 또는 yarn
- **Frontend Framework**: React.js
- **Backend Framework**: Express.js
- **Database**: SQLite (개발용), 필요시 PostgreSQL
- **ORM**: Sequelize 또는 Prisma
- **Testing**: Jest + React Testing Library

### 주요 의존성 패키지

#### 백엔드 (Node.js Express)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "sqlite3": "^5.1.6",
    "sequelize": "^6.32.0",
    "multer": "^1.4.5",
    "swagger-ui-express": "^5.0.0",
    "yamljs": "^0.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}
```

#### 프론트엔드 (React.js)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "styled-components": "^6.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/user-event": "^13.5.0"
  }
}
```

### 코딩 스타일 가이드
- **ESLint**: Airbnb 스타일 가이드 사용
- **Prettier**: 코드 포맷팅 자동화
- **파일명**: camelCase 또는 kebab-case 일관성 유지
- **컴포넌트명**: PascalCase 사용
- **변수/함수명**: camelCase 사용
