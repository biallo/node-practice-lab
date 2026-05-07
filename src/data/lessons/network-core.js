export const lesson = {
  id: 'network-core',
  title: 'net、tls 与 DNS 网络底层',
  meta: '进阶 · v18+ (2022+)',
  version:
    'HTTP 框架隐藏了大量网络细节；\nNode 的 node:net、node:tls 和 node:dns 仍然是理解连接、超时、证书、解析和代理问题的关键入口。',
  summary: '学习 TCP socket、TLS、DNS lookup/resolve、连接超时和错误事件，理解 HTTP 之下发生了什么。',
  explain: [
    {
      title: 'TCP 是字节流，不是消息流',
      body: 'net.Socket 收到的是连续字节块，不天然保留“每条消息”的边界。协议设计需要自己处理分隔符、长度前缀或帧格式。',
    },
    {
      title: '连接生命周期要完整处理',
      body: 'connect、data、end、timeout、error、close 描述了连接的不同阶段。只监听 data 会漏掉大量真实网络状态。',
    },
    {
      title: 'TLS 解决加密和身份验证',
      body: 'tls 在 TCP 之上建立加密通道，并通过证书验证对端身份。证书错误不应该被随意忽略。',
    },
    {
      title: 'DNS lookup 和 resolve 不完全相同',
      body: 'dns.lookup 接近系统解析行为，会受 hosts、系统配置和地址族影响；dns.resolve 直接查询 DNS 记录。排查网络问题时要区分。',
    },
    {
      title: '超时要分阶段理解',
      body: 'DNS、TCP 连接、TLS 握手、请求发送、响应读取都可能超时。生产代码应该知道自己限制的是哪个阶段。',
    },
  ],
  code: `import net from 'node:net';
import { lookup } from 'node:dns/promises';

const { address } = await lookup('example.com');
console.log('resolved address', address);

const socket = net.createConnection({ host: 'example.com', port: 80 });
socket.setTimeout(5_000);

socket.once('connect', () => {
  socket.write('GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n');
});

socket.on('data', (chunk) => {
  process.stdout.write(chunk);
});

socket.once('timeout', () => {
  socket.destroy(new Error('socket timeout'));
});

socket.once('error', (error) => {
  console.error('network failed', error.message);
});`,
  review: [
    '为什么 TCP socket 不是天然的一条条消息？',
    '连接的 timeout、error、close 分别表达什么？',
    'TLS 证书验证为什么不能随意关闭？',
    'dns.lookup 和 dns.resolve 的差异是什么？',
    '排查 HTTP 慢请求时，为什么要拆分 DNS、连接、TLS 和响应阶段？',
  ],
  oldNew: {
    old: 'HTTP 请求失败就是服务端接口有问题。',
    new: '一次请求背后有 DNS、TCP、TLS、代理、超时和协议解析等多个可能失败的层。',
  },
};
