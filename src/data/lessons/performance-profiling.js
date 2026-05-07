export const lesson = {
  id: 'performance-profiling',
  title: '性能剖析与内存泄漏定位',
  meta: '工程 · v18+ (2022+)',
  version:
    '现代 Node 提供了越来越多诊断入口：perf_hooks、inspector、trace events、heap snapshot 和 process 报告。\n性能问题要先定位瓶颈，再优化代码，而不是凭感觉改循环或换框架。',
  summary: '学习 event loop delay、CPU profile、heap snapshot、内存泄漏信号和诊断流程，建立性能排障的基本路径。',
  explain: [
    {
      title: '先判断瓶颈类型',
      body: 'CPU 高、事件循环延迟高、堆内存持续增长、RSS 增长、I/O 慢和下游慢是不同问题。先分类，再选择工具。',
    },
    {
      title: 'event loop delay 暴露阻塞',
      body: 'monitorEventLoopDelay 可以观察事件循环被同步代码或 CPU 任务阻塞的程度。它适合做服务健康和性能回归信号。',
    },
    {
      title: 'CPU profile 找热点',
      body: 'CPU profile 能显示时间花在哪些函数上。它比猜测更可靠，也能发现 JSON 解析、正则、序列化或加密等隐藏热点。',
    },
    {
      title: 'heap snapshot 看引用链',
      body: '内存泄漏通常是对象仍被引用。heap snapshot 可以帮助找出谁持有对象，而不是只看内存总量。',
    },
    {
      title: '优化要可验证',
      body: '每次优化前后都应记录基准、负载条件和指标变化。没有可重复度量的优化，很容易只是移动问题。',
    },
  ],
  code: `import { monitorEventLoopDelay, performance } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  const memory = process.memoryUsage();

  console.log(JSON.stringify({
    event: 'runtime.sample',
    eventLoopP95Ms: Math.round(histogram.percentile(95) / 1e6),
    heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
    rssMb: Math.round(memory.rss / 1024 / 1024),
    uptimeSec: Math.round(performance.timeOrigin / 1000 + process.uptime()),
  }));

  histogram.reset();
}, 10_000).unref();`,
  review: [
    'CPU 高和事件循环延迟高一定是同一个问题吗？',
    'monitorEventLoopDelay 适合观察什么信号？',
    'heapUsed 和 RSS 的差异为什么重要？',
    'CPU profile 相比凭经验猜热点有什么优势？',
    '为什么性能优化前后都要保留可重复的度量条件？',
  ],
  oldNew: {
    old: '服务慢了就先改循环、加缓存或换框架。',
    new: '性能排障先分类瓶颈，用 profile、heap snapshot 和指标定位，再做可验证优化。',
  },
};
