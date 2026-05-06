export const lesson = {
  id: 'worker-threads',
  title: 'Worker Threads 与 CPU 密集任务',
  meta: '进阶 · v18+',
  version:
    'worker_threads 从早期实验能力演进为稳定 API，官方文档明确它适合 CPU 密集 JavaScript 操作，不适合替代 Node 内置异步 I/O。\n现代服务要能区分 I/O 并发、CPU 并行和进程隔离。',
  summary: '学习 Worker、workerData、parentPort、消息传递和线程池设计，避免 CPU 任务阻塞主事件循环。',
  explain: [
    {
      title: 'Worker 用于并行执行 JavaScript',
      body: 'Worker 在独立线程运行 JS，可以把 CPU 密集任务从主线程挪走，例如压缩、解析、图片处理、加密计算或规则引擎。',
    },
    {
      title: '它不加速普通 I/O',
      body: '文件、网络、DNS 等 Node 内置异步 I/O 已经由运行时处理。把 I/O 包进 Worker 往往只增加通信和调度成本。',
    },
    {
      title: '消息传递有序列化成本',
      body: 'postMessage 会复制或转移数据。大对象频繁来回传会抵消并行收益。可转移 ArrayBuffer 和 SharedArrayBuffer 适合高性能场景。',
    },
    {
      title: '生产中通常使用 Worker 池',
      body: '每个任务创建一个 Worker 成本较高。真实服务通常创建固定大小的 Worker 池，按 CPU 核心数和任务耗时控制并发。',
    },
    {
      title: '线程不是故障隔离万能药',
      body: 'Worker 崩溃不会直接等同于主进程崩溃，但内存仍属于同一进程。需要处理 error、exit、超时和任务取消。',
    },
  ],
  code: `import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { n: 40 },
  });

  worker.once('message', (result) => console.log('result', result));
  worker.once('error', (error) => console.error('worker failed', error));
  worker.once('exit', (code) => {
    if (code !== 0) console.error('worker stopped with', code);
  });
} else {
  // CPU 密集计算在 worker 线程执行，不阻塞主事件循环
  parentPort.postMessage(fibonacci(workerData.n));
}`,
  review: [
    'Worker Threads 适合 CPU 密集任务，为什么不适合普通 I/O？',
    '每个任务新建 Worker 有什么成本？',
    'postMessage 传大对象会有什么性能问题？',
    'Worker 的 error 和 exit 事件分别应该如何处理？',
    'Worker 池大小为什么通常不能无限增加？',
  ],
  oldNew: {
    old: 'Node 单线程，所以 CPU 慢任务只能忍着或拆服务。',
    new: '主线程负责 I/O 和调度，CPU 密集任务可交给 Worker 池，但要管理通信、错误和并发。',
  },
};
