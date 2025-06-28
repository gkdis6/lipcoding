const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const database = require('./models/database');

const app = express();
const PORT = process.env.PORT || 8080;

// OpenAPI 문서 로드
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'openapi.yaml'));

// Swagger 옵션 설정
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: '/api-docs.json',
        name: 'Mentor-Mentee Matching API'
      }
    ]
  }
};

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JSON 형태로 API 문서 제공
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});

// Swagger UI
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '멘토-멘티 매칭 API 서버',
    version: '1.0.0',
    swagger: `http://localhost:${PORT}/swagger-ui`
  });
});

// API 라우트들
app.use('/api', require('./routes'));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 연결 종료
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// 서버 시작 및 데이터베이스 초기화
async function startServer() {
  try {
    // 데이터베이스 초기화
    await database.initialize();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/swagger-ui`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n서버를 종료합니다...');
  database.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n서버를 종료합니다...');
  database.close();
  process.exit(0);
});

// 서버 시작
startServer();

module.exports = app;
