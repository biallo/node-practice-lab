export const lesson = {
  id: 'config-env',
  title: '运行时配置与环境变量',
  meta: '工程 · v20+ (2023+)',
  version:
    '过去项目常依赖 dotenv 手动加载 .env；\n现代 Node 提供 --env-file 等能力，但生产配置仍要区分本地开发、CI、部署平台和 secret 管理。\n配置不是越灵活越好，而是越可验证越好。',
  summary: '学习环境变量、默认值、配置校验、secret、.env 文件和多环境部署，避免配置缺失在运行时才爆炸。',
  explain: [
    {
      title: '配置读取应集中',
      body: '不要在业务代码各处直接读 process.env。集中读取、校验和转换类型，能让缺失配置在启动时失败，而不是请求到达后才失败。',
    },
    {
      title: '环境变量都是字符串',
      body: 'PORT、FEATURE_ENABLED、TIMEOUT_MS 从 process.env 读出来都是字符串。布尔值和数字必须显式转换并处理非法输入。',
    },
    {
      title: '.env 适合本地，不是 secret 策略',
      body: '.env 文件方便本地开发，但真实 secret 应由部署平台、CI secret 或 secret manager 注入。不要提交真实 .env。',
    },
    {
      title: '配置要分必填和可选',
      body: '数据库 URL、签名密钥通常必填；日志级别、端口可以有默认值。明确分类能减少线上“undefined 配置”问题。',
    },
    {
      title: '启动失败比半坏服务更好',
      body: '关键配置无效时应在启动阶段抛错退出，让平台重启或阻止发布，而不是带着坏配置处理部分请求。',
    },
  ],
  code: `function readNumber(name, fallback) {
  const value = process.env[name];
  if (value == null) return fallback;

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(\`\${name} must be a number\`);
  }

  return number;
}

function readRequired(name) {
  const value = process.env[name];
  if (!value) throw new Error(\`\${name} is required\`);
  return value;
}

export const config = {
  port: readNumber('PORT', 3000),
  databaseUrl: readRequired('DATABASE_URL'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

// 本地可用：node --env-file=.env server.mjs`,
  review: [
    '为什么不建议在业务代码里到处直接读 process.env？',
    '环境变量为什么需要类型转换和校验？',
    '.env 文件适合什么场景，不适合什么场景？',
    '关键配置缺失时为什么应该启动失败？',
    '必填配置和可选配置如何区分？',
  ],
  oldNew: {
    old: '哪里需要配置就在哪里 process.env.X，缺了再说。',
    new: '启动时集中读取、校验、转换配置，secret 由部署环境注入。',
  },
};
