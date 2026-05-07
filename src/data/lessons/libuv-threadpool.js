export const lesson = {
  id: 'libuv-threadpool',
  title: 'libuv 线程池与并发边界',
  meta: '进阶 · v18+ (2022+)',
  version:
    'Node 的异步能力不等于“所有工作都在一个神秘后台无限并行”。\n许多文件、压缩、加密和 DNS 相关操作会经过 libuv 线程池；现代服务需要理解事件循环、线程池和 Worker Threads 的边界。',
  summary: '理解 libuv 线程池、UV_THREADPOOL_SIZE、异步 I/O、CPU 任务和 Worker Threads 的区别，避免把并发调到失控。',
  explain: [
    {
      title: '异步 API 背后有不同执行模型',
      body: '网络 I/O 通常由操作系统事件通知驱动；部分 fs、crypto、zlib 和 DNS 工作会使用 libuv 线程池。它们都是异步 API，但资源成本不同。',
    },
    {
      title: '线程池不是无限资源',
      body: 'libuv 线程池大小有限。大量耗时的 pbkdf2、zlib 或文件操作可能互相排队，导致看似无关的异步任务变慢。',
    },
    {
      title: 'UV_THREADPOOL_SIZE 需要谨慎',
      body: '调大线程池可能提高特定任务吞吐，也可能增加内存、上下文切换和下游压力。先度量，再调整。',
    },
    {
      title: 'Worker Threads 面向 JS CPU 并行',
      body: 'libuv 线程池服务于部分内置异步操作；Worker Threads 让你把 JavaScript CPU 密集计算放到独立线程执行。两者解决的问题不同。',
    },
    {
      title: '并发控制保护系统',
      body: 'Promise.all 不会自动理解 CPU、磁盘、数据库或第三方 API 的承载能力。生产代码通常需要队列、限流或池化来控制并发。',
    },
  ],
  code: `import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(pbkdf2);

async function runOne(id) {
  const start = performance.now();

  await deriveKey('secret', 'salt', 250_000, 32, 'sha256');

  console.log({
    id,
    durationMs: Math.round(performance.now() - start),
  });
}

// pbkdf2 会占用 libuv 线程池。
// 并发数量过大时，任务会排队，而不是无限并行。
await Promise.all(Array.from({ length: 8 }, (_, index) => runOne(index)));`,
  review: [
    '为什么“异步 API”不代表没有资源成本？',
    '哪些类型的 Node API 常会使用 libuv 线程池？',
    'UV_THREADPOOL_SIZE 调大可能带来什么副作用？',
    'libuv 线程池和 Worker Threads 的边界是什么？',
    'Promise.all 为什么不能替代并发控制？',
  ],
  oldNew: {
    old: '只要用了 async/await，任务就不会互相影响。',
    new: '异步只是调用方式，背后的线程池、CPU、磁盘和下游系统都需要容量管理。',
  },
};
