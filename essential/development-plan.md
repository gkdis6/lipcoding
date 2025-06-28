# 멘토-멘티 매칭 앱 개발 계획

## 📋 프로젝트 개요
- **목표**: 멘토와 멘티를 매칭하는 웹 애플리케이션 개발
- **제한시간**: 3시간
- **기술 스택**: React.js (Frontend) + Node.js Express (Backend) + SQLite (Database)
- **인증**: JWT 토큰 기반
- **포트**: Frontend (3000), Backend (8080)

## 🎯 개발 단계별 계획

### 1단계: 프로젝트 초기 설정 (20분)
#### 1.1 프로젝트 구조 생성
- [x] `backend/` 폴더 생성
- [x] `frontend/` 폴더 생성
- [x] `database/` 폴더 생성
- [x] `docs/` 폴더 생성

#### 1.2 백엔드 초기 설정
- [x] Node.js Express 프로젝트 초기화
- [x] 필요한 npm 패키지 설치
  - express, cors, helmet, bcryptjs, jsonwebtoken
  - sqlite3, multer, joi (입력 검증)
  - swagger-ui-express, swagger-jsdoc
- [x] 기본 폴더 구조 생성 (controllers, models, routes, middleware, services, utils)

#### 1.3 프론트엔드 초기 설정
- [x] React.js 프로젝트 생성 (`create-react-app`)
- [x] 필요한 npm 패키지 설치
  - axios, react-router-dom
  - 선택적: styled-components 또는 tailwindcss

### 2단계: 데이터베이스 설계 및 구현 (30분)
#### 2.1 SQLite 데이터베이스 스키마 설계
- [x] `users` 테이블 설계
  - id, email, password, name, role, bio, image_data, skills, created_at, updated_at
  - UNIQUE 제약: email
  - CHECK 제약: role ('mentor', 'mentee')
- [x] `matching_requests` 테이블 설계
  - id, mentor_id, mentee_id, message, status, created_at, updated_at
  - UNIQUE 제약: (mentor_id, mentee_id) - 중복 요청 방지
  - CHECK 제약: status ('pending', 'accepted', 'rejected', 'cancelled')

#### 2.2 데이터베이스 초기화
- [x] `database/init.sql` 생성
- [x] 데이터베이스 초기화 스크립트 작성
- [x] 테스트용 샘플 데이터 삽입

### 3단계: OpenAPI 문서 작성 (20분)
#### 3.1 API 명세서 기반 OpenAPI 문서 작성
- [x] `docs/openapi.yaml` 생성
- [x] 인증 API 명세 (POST /signup, POST /login)
- [x] 사용자 정보 API 명세 (GET /me, PUT /profile, GET /images/:role/:id)
- [x] 멘토 목록 API 명세 (GET /mentors)
- [x] 매칭 요청 API 명세 (POST, GET, PUT, DELETE /match-requests)

#### 3.2 Swagger UI 설정
- [x] Swagger UI 설정
- [x] OpenAPI 문서 자동 렌더링 설정

### 4단계: 백엔드 API 구현 (60분)
#### 4.1 기본 서버 설정 (10분)
- [x] Express 서버 기본 설정
- [x] CORS, 보안 미들웨어 설정
- [x] 데이터베이스 연결 설정
- [x] 에러 핸들링 미들웨어

#### 4.2 인증 시스템 구현 (20분)
- [x] JWT 토큰 생성/검증 유틸리티
- [x] 비밀번호 해싱 (bcrypt)
- [x] 인증 미들웨어 구현
- [x] POST /api/signup 구현
- [x] POST /api/login 구현

#### 4.3 사용자 프로필 API 구현 (15분)
- [x] GET /api/me 구현
- [x] PUT /api/profile 구현 (이미지 업로드 포함)
- [x] GET /api/images/:role/:id 구현

#### 4.4 멘토 관련 API 구현 (10분)
- [x] GET /api/mentors 구현 (필터링, 정렬 포함)

#### 4.5 매칭 요청 API 구현 (15분)
- [x] POST /api/match-requests 구현
- [x] GET /api/match-requests 구현
- [x] PUT /api/match-requests/:id 구현
- [x] DELETE /api/match-requests/:id 구현

### 5단계: 프론트엔드 구현 (70분)
#### 5.1 기본 설정 및 라우팅 (15분)
- [x] React Router 설정
- [x] 인증 상태 관리 (Context API 또는 간단한 상태 관리)
- [x] API 서비스 함수 작성 (axios 기반)
- [x] 기본 레이아웃 및 네비게이션 컴포넌트

#### 5.2 인증 페이지 구현 (20분)
- [x] 로그인 페이지 (`/login`) - 테스트 ID 포함
- [x] 회원가입 페이지 (`/signup`) - 테스트 ID 포함
- [x] 인증 상태에 따른 리디렉션 로직
- [x] JWT 토큰 저장 및 관리
- [x] 프론트엔드 자동화 테스트 실행 및 통과 확인

#### 5.3 프로필 페이지 구현 (15분)
- [x] 프로필 조회/수정 페이지 (`/profile`) - 테스트 ID 포함
- [x] 이미지 업로드 기능
- [x] 멘토/멘티 역할별 폼 차이점 처리

#### 5.4 멘토 관련 페이지 구현 (멘티용) (10분)
- [x] 멘토 목록 페이지 (`/mentors`) - 테스트 ID 포함
- [x] 검색 및 정렬 기능
- [x] 매칭 요청 보내기 기능

#### 5.5 요청 관리 페이지 구현 (10분)
- [x] 요청 목록 페이지 (`/requests`) - 테스트 ID 포함
- [x] 멘토용: 받은 요청 수락/거절
- [x] 멘티용: 보낸 요청 상태 확인 및 취소

### 6단계: 통합 테스트 및 디버깅 (20분)
#### 6.1 기능 테스트
- [x] 회원가입/로그인 플로우 테스트 - API 및 전체 플로우 검증 완료
- [x] 프로필 생성/수정 테스트 - 프로필 업데이트 API 동작 확인
- [x] 멘토 검색 및 매칭 요청 테스트 - 멘토 목록 조회 및 매칭 요청 생성 확인
- [x] 요청 수락/거절 테스트 - 멘토의 요청 수락 및 상태 업데이트 확인

#### 6.2 UI/UX 개선
- [x] 반응형 디자인 확인 - 모바일 미디어 쿼리 및 반응형 스타일 개선 완료
- [x] 에러 메시지 및 사용자 피드백 개선 - 알림 스타일, 로딩 애니메이션 추가
- [x] 테스트 ID 속성 누락 확인 - Login, Signup, Profile, Requests 페이지 테스트 ID 추가

### 7단계: 최종 점검 및 문서화 (10분)
#### 7.1 실행 환경 확인
- [x] 백엔드 `npm start`로 localhost:8080 실행 확인
- [x] 프론트엔드 `npm start`로 localhost:3000 실행 확인
- [x] Swagger UI (localhost:8080/swagger-ui) 접근 확인

#### 7.2 보안 및 명세 준수 확인
- [x] JWT 토큰 필수 클레임 포함 확인 (iss, sub, aud, exp, nbf, iat, jti + name, email, role)
- [x] SQL 인젝션 방지 확인 (Prepared Statements 사용)
- [x] XSS 방지 확인 (입력값 검증)
- [x] API 명세서 100% 준수 확인

## 🔧 필수 체크리스트

### 백엔드 필수사항
- [x] 포트 8080에서 실행
- [x] `/api` 경로 하위에 모든 API 엔드포인트
- [x] JWT 토큰 인증 (필수 클레임 포함)
- [x] SQLite 데이터베이스 사용
- [x] OpenAPI 문서 자동 생성
- [x] Swagger UI 제공

### 프론트엔드 필수사항
- [x] 포트 3000에서 실행
- [x] React.js 사용
- [x] 모든 HTML 요소에 테스트 ID 속성
- [x] 역할별 네비게이션 (멘토/멘티)
- [x] 반응형 디자인

### 보안 필수사항
- [x] SQL 인젝션 방지 (Prepared Statements)
- [x] XSS 방지 (입력값 검증)
- [x] JWT 토큰 보안
- [x] 파일 업로드 검증 (이미지 형식, 크기)

## ⚠️ 주의사항
1. **README.md 명세 100% 준수 필수**
2. **포트 번호 (3000, 8080) 변경 금지**
3. **API 경로 (/api) 변경 금지**
4. **HTML 요소 ID 규칙 엄격 준수** (자동화 테스트용)
5. **사용자 스토리 모든 요구사항 구현**

## 📝 개발 우선순위
1. **백엔드 API 구현 우선** (프론트엔드에서 사용할 API가 필요)
2. **인증 시스템 먼저 구현** (모든 기능의 기반)
3. **핵심 기능 우선 구현** (회원가입 → 로그인 → 프로필 → 매칭)
4. **UI/UX는 마지막에 개선**

이 계획에 따라 단계별로 진행하시면 제한 시간 내에 요구사항을 만족하는 앱을 완성할 수 있습니다.
