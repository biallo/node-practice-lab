export const lesson = {
  id: 'deployment-containers',
  title: '部署、容器与运行时运维',
  meta: '工程 · v18+ (2022+)',
  version:
    'Node 服务进入容器和编排平台后，日志、信号、健康检查、环境变量、内存限制和镜像构建都会影响稳定性。\n现代 Node 工程要让应用适应平台，而不是只在本地 npm run dev 成功。',
  summary: '学习 Docker 信号、健康检查、graceful shutdown、env 注入、stdout/stderr 日志、memory limit 和 OOM 风险。',
  explain: [
    {
      title: '容器通过信号停止进程',
      body: 'Kubernetes、Docker 和进程管理器通常先发送 SIGTERM，再在超时后强制结束。应用要监听信号并优雅关闭。',
    },
    {
      title: '日志应该输出到标准流',
      body: '容器平台会采集 stdout/stderr。应用不应默认依赖本地日志文件，结构化日志也应写到标准流交给平台收集。',
    },
    {
      title: '健康检查要区分语义',
      body: 'liveness 表示进程是否需要重启，readiness 表示是否能接流量。数据库断开时服务可能活着，但不应该 ready。',
    },
    {
      title: '内存限制会改变失败模式',
      body: '容器有 memory limit，Node 堆内存、Buffer、native 依赖和 RSS 都会计入。OOM 可能直接杀进程，不一定留下 JS 异常。',
    },
    {
      title: '镜像构建要可重复',
      body: '生产镜像应使用 lockfile、固定 Node 基础镜像、只安装必要依赖，并避免把 secret 或本地缓存打进镜像。',
    },
  ],
  code: `import http from 'node:http';

let ready = false;

const server = http.createServer((req, res) => {
  if (req.url === '/livez') {
    res.writeHead(200).end('live');
    return;
  }

  if (req.url === '/readyz') {
    res.writeHead(ready ? 200 : 503).end(ready ? 'ready' : 'not ready');
    return;
  }

  res.writeHead(404).end();
});

server.listen(process.env.PORT ?? 3000, () => {
  ready = true;
  console.log(JSON.stringify({ event: 'server.ready' }));
});

process.once('SIGTERM', () => {
  ready = false;
  server.close(() => {
    console.log(JSON.stringify({ event: 'server.closed' }));
  });
});`,
  review: [
    '容器平台停止服务时，SIGTERM 和强制结束通常如何配合？',
    '为什么容器应用应把日志写到 stdout/stderr？',
    'liveness 和 readiness 为什么不能混成一个接口？',
    'Node 在容器内为什么要关注 RSS，而不只是 heapUsed？',
    '生产镜像为什么要避免包含 secret 和本地缓存？',
  ],
  oldNew: {
    old: 'Docker 里能启动 Node 服务就算部署完成。',
    new: '生产部署要设计信号处理、健康检查、标准流日志、内存限制、镜像可重复构建和平台关闭流程。',
  },
};
