export const lesson = {
  id: 'http-server',
  title: 'node:http 服务端基础',
  meta: '服务 · v18+',
  version:
    '框架流行之前，node:http 就是 Node 服务端基础。现代项目常用 Fastify/Express，但理解原生 request/response、流式 body、header、状态码和优雅关闭，能帮你读懂任何框架。',
  summary: '从原生 http server 理解路由、请求体、JSON 响应、错误处理、超时和优雅关闭。',
  explain: [
    {
      title: '请求和响应都是流',
      body: 'IncomingMessage 是可读流，ServerResponse 是可写流。小 JSON 可以收集完整 body，大文件上传则应流式处理。',
    },
    {
      title: '路由本质是 method + URL',
      body: '框架路由最终都要判断请求方法和路径。理解 URL 解析、query、状态码和 header，是学习框架前的底层基础。',
    },
    {
      title: '错误响应也要结构化',
      body: '服务端应统一返回 JSON 错误格式，并区分 400、404、409、500。不要把内部错误栈直接暴露给客户端。',
    },
    {
      title: '超时和 body 限制保护服务',
      body: '请求体无限大或连接迟迟不结束会拖垮服务。真实服务要设置 body size limit、request timeout 和反向代理限制。',
    },
    {
      title: '优雅关闭避免中断请求',
      body: '收到 SIGTERM 时停止接新连接，等待已有请求完成，再关闭资源。容器和部署平台通常依赖这个生命周期。',
    },
  ],
  code: `import { createServer } from 'node:http';

async function readJson(req, limit = 1024 * 1024) {
  let size = 0;
  let body = '';

  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Body too large');
    body += chunk;
  }

  return body ? JSON.parse(body) : {};
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/notes') {
      const note = await readJson(req);
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ id: Date.now(), ...note }));
      return;
    }

    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'not_found' }));
  } catch {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'bad_request' }));
  }
});

server.listen(3000);`,
  review: [
    '为什么请求体应该设置大小限制？',
    '框架路由最终仍然依赖哪些 HTTP 基础概念？',
    '错误响应为什么不应该直接返回内部 stack？',
    '收到 SIGTERM 时服务应该怎样优雅关闭？',
    '什么时候应该流式处理 body，而不是一次性拼字符串？',
  ],
  oldNew: {
    old: '直接上框架，不理解 request、response、header、body。',
    new: '用原生 http 建立底层模型，再用框架提升开发效率。',
  },
};
