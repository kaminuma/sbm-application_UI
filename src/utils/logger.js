// ログレベル定義
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// 現在の環境に基づくログレベル設定
const getCurrentLogLevel = () => {
  const env = import.meta.env.MODE;

  switch (env) {
    case 'production':
      return LOG_LEVELS.ERROR; // 本番環境ではエラーのみ
    case 'staging':
      return LOG_LEVELS.WARN;  // ステージング環境では警告まで
    case 'development':
    default:
      return LOG_LEVELS.DEBUG; // 開発環境では全て
  }
};

const currentLogLevel = getCurrentLogLevel();

// 機密情報をマスクする関数
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;

  const sensitive = ['password', 'token', 'refreshToken', 'authorization', 'cookie'];
  const sanitized = { ...data };

  for (const key in sanitized) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[MASKED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }

  return sanitized;
};

// ログ出力関数
const logger = {
  error: (message, data = null) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, data ? sanitizeData(data) : '');
    }
  },

  warn: (message, data = null) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, data ? sanitizeData(data) : '');
    }
  },

  info: (message, data = null) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(`[INFO] ${message}`, data ? sanitizeData(data) : '');
    }
  },

  debug: (message, data = null) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, data ? sanitizeData(data) : '');
    }
  }
};

export default logger;