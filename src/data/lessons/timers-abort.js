export const lesson = {
  id: 'timers-abort',
  title: 'Timers、AbortSignal 与调度',
  meta: '实战 · v18+ (2022+)',
  version:
    '旧代码常用 setTimeout 包 Promise 或 Promise.race 做超时；\n现代 Node 提供 node:timers/promises，并且越来越多 API 支持 AbortSignal。\n学习取消协议比手写超时包装更重要。',
  summary: '理解 setTimeout、setInterval、setImmediate、timers/promises、AbortController 和资源清理。',
  explain: [
    {
      title: 'timers/promises 让等待可 await',
      body: 'node:timers/promises 提供 setTimeout 的 Promise 版本，适合重试、退避、测试和后台任务调度。',
    },
    {
      title: 'AbortSignal 表示取消意图',
      body: 'AbortController 可以同时取消 fetch、delay、stream pipeline 等支持 signal 的操作。取消应该向底层传播，而不是只忽略结果。',
    },
    {
      title: 'setInterval 要注意重入',
      body: '如果定时任务耗时超过间隔，setInterval 可能造成任务重叠。后台任务更常用递归 setTimeout 或循环 await delay 控制节奏。',
    },
    {
      title: 'unref 允许进程自然退出',
      body: '定时器默认会让进程保持存活。对非关键后台定时器调用 unref，可以让没有其他工作时进程自然退出。',
    },
    {
      title: '重试要有上限和退避',
      body: '无限重试会放大故障。网络请求、任务消费和外部服务调用应设置最大次数、指数退避和抖动。'
    },
  ],
  code: `import { setTimeout as delay } from 'node:timers/promises';

async function retry(operation, { attempts = 3, signal } = {}) {
  for (let index = 1; index <= attempts; index += 1) {
    try {
      return await operation({ signal });
    } catch (error) {
      if (index === attempts || signal?.aborted) throw error;

      // 简单指数退避：100ms、200ms、400ms
      await delay(100 * 2 ** (index - 1), undefined, { signal });
    }
  }
}

const controller = new AbortController();
setTimeout(() => controller.abort(), 5000).unref();

await retry(
  ({ signal }) => fetch('https://nodejs.org/api/', { signal }),
  { attempts: 3, signal: controller.signal },
);`,
  review: [
    'AbortSignal 和 Promise.race 超时有什么关键差异？',
    '为什么 setInterval 可能导致任务重入？',
    'unref 对 CLI 工具或后台定时器有什么意义？',
    '重试为什么要有次数上限和退避？',
    '哪些 Node API 已经常见支持 signal？',
  ],
  oldNew: {
    old: '用 setTimeout 包一层 Promise，超时后只是不处理结果。',
    new: '用 timers/promises 和 AbortSignal 把取消意图传到底层，并控制重试节奏。',
  },
};
