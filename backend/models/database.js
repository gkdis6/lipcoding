const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
  }

  // 데이터베이스 연결 및 초기화
  async initialize() {
    return new Promise((resolve, reject) => {
      // 데이터베이스 파일 경로
      const dbPath = path.join(__dirname, '..', '..', 'database', 'mentor_mentee.db');
      
      // 데이터베이스 디렉토리가 없으면 생성
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      console.log(`데이터베이스 파일 경로: ${dbPath}`);

      // SQLite 데이터베이스 연결
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('데이터베이스 연결 실패:', err.message);
          reject(err);
          return;
        }
        console.log('SQLite 데이터베이스에 연결되었습니다.');
      });

      // 외래키 제약 조건 활성화
      this.db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error('외래키 활성화 실패:', err.message);
          reject(err);
          return;
        }
      });

      // 초기화 스크립트 실행
      this.runInitScript()
        .then(() => {
          console.log('데이터베이스 초기화 완료');
          resolve();
        })
        .catch(reject);
    });
  }

  // 초기화 스크립트 실행
  async runInitScript() {
    return new Promise((resolve, reject) => {
      const initScriptPath = path.join(__dirname, '..', '..', 'database', 'init.sql');
      
      if (!fs.existsSync(initScriptPath)) {
        reject(new Error(`init.sql 파일을 찾을 수 없습니다. 경로: ${initScriptPath}`));
        return;
      }

      const initScript = fs.readFileSync(initScriptPath, 'utf8');
      
      this.db.exec(initScript, (err) => {
        if (err) {
          console.error('초기화 스크립트 실행 실패:', err.message);
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  // 데이터베이스 인스턴스 반환
  getDb() {
    if (!this.db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }
    return this.db;
  }

  // 연결 종료
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('데이터베이스 연결 종료 실패:', err.message);
        } else {
          console.log('데이터베이스 연결이 종료되었습니다.');
        }
      });
    }
  }

  // Prepared Statement를 위한 헬퍼 메서드들
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

// 싱글톤 인스턴스 생성
const database = new Database();

module.exports = database;
