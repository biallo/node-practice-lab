export const lesson = {
  id: 'crypto-webcrypto',
  title: 'Crypto、Web Crypto 与密码学边界',
  meta: '安全 · v18+ (2022+)',
  version:
    'Node 传统 node:crypto API 长期存在，现代 Node 也提供 Web Crypto API（globalThis.crypto.subtle），更贴近浏览器标准。\n新代码要区分哈希、HMAC、加密、签名和密码存储，不要自创算法。',
  summary: '理解随机数、哈希、HMAC、对称加密、签名、Web Crypto 和密码存储边界，知道哪些事情不能自己发明。',
  explain: [
    {
      title: '随机数必须来自 CSPRNG',
      body: '令牌、nonce、salt、session id 应使用 crypto.randomUUID、randomBytes 或 Web Crypto 的 getRandomValues。Math.random 不适合安全场景。',
    },
    {
      title: '哈希不是加密',
      body: '哈希是单向摘要，不能解密。适合完整性校验、缓存 key、内容指纹；不适合直接存用户密码。',
    },
    {
      title: 'HMAC 用于认证消息',
      body: 'HMAC 把密钥和消息一起计算摘要，可用于 webhook 签名验证。普通 hash 不能证明消息来自持有密钥的一方。',
    },
    {
      title: '密码存储要用专用 KDF',
      body: '用户密码应使用 scrypt、bcrypt、argon2 这类慢哈希/KDF，并为每个密码使用独立 salt。不要用 sha256(password)。',
    },
    {
      title: 'Web Crypto 更标准但也更严格',
      body: 'crypto.subtle API 返回 Promise，算法参数更结构化。它适合跨运行时共享思路，但使用前要确认 Node 版本和算法支持。',
    },
  ],
  code: `import { createHmac, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

// token 使用安全随机数，不使用 Math.random\nconst token = randomBytes(32).toString('hex');
console.log(token);

// HMAC 可用于验证 webhook 签名\nfunction signWebhook(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

// 用户密码使用 scrypt 等 KDF，不直接 sha256(password)\nasync function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);
  return \`\${salt.toString('hex')}:\${derivedKey.toString('hex')}\`;
}`,
  review: [
    '为什么 Math.random 不能生成 token？',
    'hash、HMAC、加密、签名分别解决什么问题？',
    '为什么 sha256(password) 不适合存密码？',
    'Web Crypto 和 node:crypto 的使用体验有什么差异？',
    '自己设计加密协议为什么危险？',
  ],
  oldNew: {
    old: '把 crypto 当成“调一个 sha256 就安全”的工具。',
    new: '先区分安全目标，再选择随机数、HMAC、KDF、加密或签名，避免自创密码学。',
  },
};
