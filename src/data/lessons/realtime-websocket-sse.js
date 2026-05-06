export const lesson = {
  id: 'realtime-websocket-sse',
  title: '实时通信：WebSocket 与 SSE',
  meta: '进阶 · v18+',
  version:
    'HTTP 请求响应模型不适合所有实时场景。\nNode 常用于 WebSocket、SSE、长连接和事件推送，但长连接会放大连接生命周期、心跳、背压、重连和广播成本。',
  summary: '学习 WebSocket 与 Server-Sent Events 的适用场景、连接生命周期、ping/pong、重连、背压和水平扩展边界。',
  explain: [
    {
      title: 'WebSocket 是双向长连接',
      body: 'WebSocket 适合聊天、协作编辑、游戏状态等客户端和服务端都要主动发送消息的场景。连接越多，生命周期管理越重要。',
    },
    {
      title: 'SSE 适合服务端单向推送',
      body: 'SSE 基于 HTTP，浏览器原生支持自动重连，适合通知、进度、状态流和日志流。它不适合客户端高频上行消息。',
    },
    {
      title: '心跳发现半开连接',
      body: '移动网络、代理和 NAT 可能让连接半开。ping/pong 或应用层心跳能帮助服务端释放已经失效的连接。',
    },
    {
      title: '实时消息也有背压',
      body: '慢客户端会积压发送缓冲区。服务端要限制队列长度、丢弃可丢消息或断开异常慢连接。',
    },
    {
      title: '水平扩展需要共享状态',
      body: '多进程或多实例部署时，连接分散在不同节点。广播、房间和 presence 通常需要 Redis、消息总线或粘性会话配合。',
    },
  ],
  code: `import http from 'node:http';

const clients = new Set();

const server = http.createServer((req, res) => {
  if (req.url !== '/events') {
    res.writeHead(404).end();
    return;
  }

  res.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  });

  clients.add(res);
  req.once('close', () => clients.delete(res));
});

setInterval(() => {
  const payload = JSON.stringify({ now: Date.now() });

  for (const client of clients) {
    client.write(\`event: heartbeat\\ndata: \${payload}\\n\\n\`);
  }
}, 15_000).unref();

server.listen(3000);`,
  review: [
    'WebSocket 和 SSE 的核心适用场景有什么差异？',
    '为什么长连接需要心跳？',
    '慢客户端如何造成实时系统背压？',
    'SSE 为什么天然更适合服务端单向推送？',
    '多实例部署时，广播和房间状态会遇到什么问题？',
  ],
  oldNew: {
    old: '实时功能就是开个 WebSocket，把消息发出去。',
    new: '实时系统要处理连接生命周期、心跳、背压、重连、广播状态和多实例扩展。',
  },
};
