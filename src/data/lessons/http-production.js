export const lesson = {
  id: 'http-production',
  title: 'HTTP 生产边界与优雅关闭',
  meta: '工程 · v18+',
  version:
    '从能返回 JSON 到能稳定接入流量，中间还隔着超时、请求体大小、代理头、CORS、限流和优雅关闭。\n现代 Node 服务不应该只依赖框架默认值。',
  summary: '理解 HTTP 服务的生产边界：超时、body limit、CORS、代理、压缩、限流和 graceful shutdown。',
  explain: [
    {
      title: '超时保护连接资源',
      body: 'headersTimeout、requestTimeout、keepAliveTimeout 等设置能避免慢连接长期占用资源。不同超时保护的是不同阶段。',
    },
    {
      title: '请求体必须设上限',
      body: 'JSON、文件上传和表单都可能被恶意或误用放大。服务端应该限制 body size，并在超限时尽早拒绝。',
    },
    {
      title: '代理头只能信任可信代理',
      body: 'X-Forwarded-For、X-Forwarded-Proto 等头常由反向代理添加。直接信任来自公网客户端的代理头会导致安全和审计问题。',
    },
    {
      title: 'CORS 是浏览器访问控制',
      body: 'CORS 决定浏览器是否允许前端读取跨源响应。它不是服务端鉴权，也不能替代 token、cookie 或权限校验。',
    },
    {
      title: '优雅关闭要停止接新请求',
      body: '收到 SIGTERM 后，服务应先关闭监听入口，再等待正在处理的请求完成，并设置最大等待时间，避免部署时硬杀进程。',
    },
  ],
  code: `import http from 'node:http';

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' || req.url !== '/healthz') {
    res.writeHead(404).end();
    return;
  }

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.headersTimeout = 10_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 5_000;

server.listen(3000);

process.once('SIGTERM', () => {
  console.log('draining http server');

  server.close((error) => {
    process.exitCode = error ? 1 : 0;
  });

  setTimeout(() => {
    console.error('forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
});`,
  review: [
    'headersTimeout、requestTimeout 和 keepAliveTimeout 分别保护什么？',
    '为什么所有请求体都应该有大小上限？',
    'CORS 为什么不能替代服务端鉴权？',
    '什么时候可以信任 X-Forwarded-For？',
    '优雅关闭为什么要先停止接收新请求？',
  ],
  oldNew: {
    old: 'HTTP 服务能 listen 并返回 JSON 就可以上线。',
    new: '生产 HTTP 服务要显式设计超时、输入上限、代理边界、跨源策略和关闭流程。',
  },
};
