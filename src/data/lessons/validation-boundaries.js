export const lesson = {
  id: 'validation-boundaries',
  title: '数据校验与信任边界',
  meta: '工程 · v18+',
  version:
    'TypeScript、JSDoc 或 IDE 提示只能帮助开发期；\nNode 程序运行时仍会收到未知 JSON、环境变量、文件内容、消息队列事件和第三方响应。现代服务需要在边界处做运行时校验。',
  summary: '学习信任边界、schema validation、输入规范化、错误返回和内部类型收窄，避免让脏数据进入核心逻辑。',
  explain: [
    {
      title: '外部输入默认不可信',
      body: 'HTTP body、query、env、配置文件、数据库旧数据和第三方 API 响应都属于边界输入。它们进入业务核心前应该先校验。',
    },
    {
      title: '校验应该靠近边界',
      body: '在入口处把 unknown 数据转换成可信结构，内部代码就能少写防御性判断，也更容易测试。',
    },
    {
      title: '规范化和校验不同',
      body: 'trim、大小写转换、默认值填充属于规范化；类型、范围、枚举和格式检查属于校验。两者都重要，但不要混淆意图。',
    },
    {
      title: '错误信息要可操作',
      body: '对用户返回清晰字段错误，对日志保留足够上下文。不要把原始 secret、token 或完整敏感 payload 打进日志。',
    },
    {
      title: 'schema 是跨边界协议',
      body: 'schema 不只服务 HTTP，也能用于 env、JSON 文件、队列消息和测试 fixture，让数据契约更稳定。',
    },
  ],
  code: `function parsePort(value) {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

function parseCreateUser(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('request body must be an object');
  }

  const name = String(input.name ?? '').trim();
  const email = String(input.email ?? '').trim().toLowerCase();

  if (name.length < 1) throw new Error('name is required');
  if (!email.includes('@')) throw new Error('email must be valid');

  return { name, email };
}

const config = {
  port: parsePort(process.env.PORT ?? '3000'),
};`,
  review: [
    '为什么 TypeScript 不能替代运行时校验？',
    '哪些输入应该被视为信任边界？',
    '规范化和校验分别解决什么问题？',
    '为什么校验应该尽量靠近入口？',
    '校验失败的错误信息应该如何兼顾用户和日志？',
  ],
  oldNew: {
    old: '前端会传正确字段，TypeScript 类型也写了，所以后端不用再校验。',
    new: '类型只描述期望；所有跨边界数据都要在运行时校验、规范化，再进入业务核心。',
  },
};
