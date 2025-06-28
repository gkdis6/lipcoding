---
applyTo: '**'
---

# 멘토-멘티 매칭 앱 개발 지침

## 📋 프로젝트 컨텍스트
- **프로젝트**: 멘토-멘티 매칭 웹 애플리케이션
- **기술 스택**: React.js (Frontend) + Node.js Express (Backend) + SQLite (Database)
- **인증**: JWT 토큰 기반
- **API 문서**: OpenAPI 3.0 + Swagger UI

## 🎯 개발 원칙

### 1. README 파일 우선 참조
- **모든 개발 작업은 README.md 파일의 명세를 기준으로 진행**
- 프로젝트 구조, API 엔드포인트, 데이터베이스 스키마 등 모든 정보는 '/essential' 내의 파일들 참조
- /essential/development-plan.md의 계획에 따라 단계별로 개발 진행
- 사용자 스토리와 기능 요구사항을 반드시 준수
- 테스트를 위한 HTML 요소 ID 규칙 엄격히 준수

### 2. 기술 스택 준수
- **Frontend**: React.js (포트 3000)
- **Backend**: Node.js Express (포트 8080)
- **Database**: SQLite (로컬 개발용)
- **인증**: JWT (RFC 7519 표준 준수)

### 3. 코딩 표준
- **JavaScript/Node.js**: ESLint Airbnb 스타일 가이드
- **파일명**: camelCase 또는 kebab-case 일관성 유지
- **컴포넌트명**: PascalCase
- **변수/함수명**: camelCase
- **API 응답**: 항상 JSON 형식

### 4. 보안 요구사항
- JWT 토큰에 필수 클레임 (iss, sub, aud, exp, nbf, iat, jti) 포함
- 커스텀 클레임 (name, email, role) 포함
- SQL 인젝션 방지 (Prepared Statements)
- XSS 방지 (입력값 검증)
- OWASP TOP 10 취약점 대응

### 5. API 설계 원칙
- **OpenAPI 3.0 명세 우선 개발**
- RESTful 설계 원칙 준수
- 모든 보호된 엔드포인트에 Bearer 토큰 인증
- 일관된 에러 응답 형식
- HTTP 상태 코드 의미적 사용

### 6. 데이터베이스 제약사항
- users 테이블: 이메일 UNIQUE, role CHECK 제약
- matching_requests 테이블: 중복 요청 방지 UNIQUE 제약
- 매칭 상태: pending, accepted, rejected, cancelled만 허용

### 7. UI/UX 요구사항
- 반응형 디자인 (모바일 친화적)
- 역할별 네비게이션 (멘토/멘티 구분)
- 프로필 이미지: .jpg/.png, 500x500~1000x1000px, 최대 1MB
- 기본 이미지 URL 사용 (placehold.co)

### 8. 테스트 가능성
- HTML 요소에 테스트용 ID 속성 필수 추가
- 자동화된 테스트를 위한 data-testid 속성 사용
- E2E 테스트 시나리오 고려한 UI 구현

### 9. 개발 워크플로우
1. README.md의 사용자 스토리 확인
2. OpenAPI 명세 작성/확인
3. 백엔드 API 구현
4. 프론트엔드 컴포넌트 구현
5. 테스트 ID 속성 추가
6. 로컬 테스트 실행

### 10. 제출 준비사항
- 백엔드: `npm start`로 localhost:8080에서 실행
- 프론트엔드: `npm start`로 localhost:3000에서 실행
- Swagger UI: localhost:8080/swagger-ui 접근 가능
- 데이터베이스 초기화 스크립트 포함
- README.md에 실행 명령어 명시

## ⚠️ 중요사항
- **모든 구현은 README.md 파일의 명세를 100% 준수해야 함**
- 평가 시 자동화된 테스트가 진행되므로 명세 준수 필수
- 포트 번호 (3000, 8080) 및 API 경로 (/api) 변경 금지
- HTML 요소 ID 규칙 위반 시 UI 테스트 실패 가능성