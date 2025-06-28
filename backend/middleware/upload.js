const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, '..', 'uploads');
const profilesDir = path.join(uploadDir, 'profiles');

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// 스토리지 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilesDir);
  },
  filename: function (req, file, cb) {
    // 파일명: userId_timestamp.확장자
    const userId = req.user ? req.user.id : 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_${timestamp}${ext}`);
  }
});

// 파일 필터 (이미지만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF) are allowed'), false);
  }
};

// Multer 설정
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
    files: 1 // 하나의 파일만
  }
});

// 프로필 이미지 업로드 미들웨어
const uploadProfileImage = upload.single('profile_image');

// 에러 핸들링 래퍼
function handleUploadError(req, res, next) {
  uploadProfileImage(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'File size too large. Maximum size is 5MB.'
        });
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Too many files. Only one file is allowed.'
        });
      } else {
        return res.status(400).json({
          error: 'Bad Request',
          message: err.message
        });
      }
    } else if (err) {
      return res.status(400).json({
        error: 'Bad Request',
        message: err.message
      });
    }
    next();
  });
}

module.exports = {
  uploadProfileImage: handleUploadError
};
