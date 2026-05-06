export const lesson = {
  id: 'observability-otel',
  title: 'OpenTelemetry 与可观测性进阶',
  meta: '工程 · v18+',
  version:
    '现代 Node 服务排障不只靠日志；\nOpenTelemetry 把 trace、metric 和 log 组织成跨服务的观测协议，AsyncLocalStorage 和 diagnostics_channel 则是 Node 生态接入追踪上下文的重要基础。',
  summary: '理解 trace、span、metrics、logs、traceId/requestId 和上下文传播，知道如何把 Node 服务接入可观测性系统。',
  explain: [
    {
      title: 'trace 描述一次跨服务请求',
      body: 'trace 由多个 span 组成，能把入口 HTTP、数据库查询、队列投递和下游请求串起来。它回答“这次请求一路经过了哪里”。',
    },
    {
      title: 'span 记录一段工作',
      body: 'span 通常包含名称、开始结束时间、状态、属性和异常信息。命名应稳定，属性要避免高基数字段和敏感数据。',
    },
    {
      title: 'metrics 适合看趋势',
      body: '请求量、错误率、延迟分位数、队列积压和内存使用适合做指标。日志适合看细节，trace 适合看链路，metrics 适合看整体健康。',
    },
    {
      title: 'requestId 不等于 traceId',
      body: 'requestId 常是应用内日志关联 ID；traceId 是分布式追踪协议里的链路 ID。可以同时记录，但不要混淆它们的语义。',
    },
    {
      title: '上下文传播是关键',
      body: '跨 async/await、回调、HTTP header 和队列消息传播 trace context，才能让链路不断裂。AsyncLocalStorage 常用于保存当前请求上下文。',
    },
  ],
  code: `import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const context = new AsyncLocalStorage();

function withSpan(name, attributes, fn) {
  const parent = context.getStore();
  const span = {
    traceId: parent?.traceId ?? randomUUID(),
    spanId: randomUUID(),
    parentSpanId: parent?.spanId,
    name,
    attributes,
    start: performance.now(),
  };

  return context.run(span, async () => {
    try {
      return await fn();
    } catch (error) {
      span.error = error.message;
      throw error;
    } finally {
      console.log(JSON.stringify({
        event: 'span.end',
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        name: span.name,
        durationMs: Math.round(performance.now() - span.start),
      }));
    }
  });
}

await withSpan('http.request', { route: 'GET /users/:id' }, async () => {
  await withSpan('db.query', { table: 'users' }, async () => queryUser());
});`,
  review: [
    'trace 和 span 分别表达什么？',
    'metrics、logs、trace 各适合回答什么问题？',
    'requestId 和 traceId 为什么不完全等价？',
    'span 属性为什么要避免敏感数据和高基数字段？',
    'AsyncLocalStorage 如何帮助追踪上下文传播？',
  ],
  oldNew: {
    old: '线上问题靠 grep 日志和猜测下游哪个慢。',
    new: '用 trace 串链路、metrics 看趋势、logs 查细节，让每次请求都有可追踪上下文。',
  },
};
