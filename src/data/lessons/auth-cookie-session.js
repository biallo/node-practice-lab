export const lesson = {
  id: 'auth-cookie-session',
  title: '认证、Cookie、Session 与 CSRF',
  meta: '工程 · v18+ (2022+)',
  version:
    '认证不是“生成一个 JWT”这么简单。\n现代 Web 服务需要理解 cookie flags、session、token 生命周期、CSRF、XSS 和服务端权限校验之间的边界。',
  summary: '学习 HttpOnly、Secure、SameSite、session vs JWT、CSRF、XSS、token 过期和刷新，建立认证授权基本模型。',
  explain: [
    {
      title: '认证和授权不同',
      body: '认证回答“你是谁”，授权回答“你能做什么”。登录成功只建立身份，具体资源访问仍要在服务端检查权限。',
    },
    {
      title: 'Cookie flag 是安全边界',
      body: 'HttpOnly 降低脚本读取风险，Secure 要求 HTTPS，SameSite 能缓解部分 CSRF。生产 cookie 应明确设置这些属性。',
    },
    {
      title: 'Session 和 JWT 各有成本',
      body: 'Session 易于服务端撤销，但需要存储；JWT 便于无状态校验，但撤销、权限变更和泄露处理更复杂。',
    },
    {
      title: 'CSRF 利用浏览器自动带 cookie',
      body: '如果认证依赖 cookie，跨站请求可能自动携带身份。SameSite、CSRF token 和 Origin 校验都是常见防线。',
    },
    {
      title: 'XSS 会破坏很多假设',
      body: '一旦页面能执行恶意脚本，攻击者可代用户发请求。HttpOnly 保护 token 不被直接读取，但不能替代输出转义和内容安全策略。',
    },
  ],
  code: `import http from 'node:http';
import { randomUUID } from 'node:crypto';

function setSessionCookie(res, sessionId) {
  res.setHeader('set-cookie', [
    [
      \`sid=\${sessionId}\`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Max-Age=3600',
    ].join('; '),
  ]);
}

function assertSameOrigin(req) {
  const origin = req.headers.origin;

  if (origin && origin !== 'https://app.example.com') {
    throw new Error('invalid origin');
  }
}

http.createServer((req, res) => {
  if (req.method === 'POST') assertSameOrigin(req);

  setSessionCookie(res, randomUUID());
  res.end('ok');
});`,
  review: [
    '认证和授权的边界是什么？',
    'HttpOnly、Secure、SameSite 分别降低什么风险？',
    'Session 和 JWT 在撤销能力上有什么差异？',
    '为什么依赖 cookie 的接口要考虑 CSRF？',
    'XSS 为什么会削弱很多认证设计？',
  ],
  oldNew: {
    old: '登录就是签一个 JWT，前端保存起来就行。',
    new: '认证系统要设计身份、权限、cookie 属性、token 生命周期、CSRF/XSS 防线和撤销策略。',
  },
};
