export const lesson = {
  id: 'async-local-storage',
  title: 'AsyncLocalStorage 与请求上下文',
  meta: '进阶 · v18+ / v24 增强',
  version:
    'AsyncLocalStorage 在 v16.4.0 后稳定，v24 增加 defaultValue 和 name 选项，v22.15.0/v23.11.0 标记 bind、snapshot 稳定。\n它是现代 Node 服务做 request id、trace id 和多租户上下文的重要基础。',
  summary: '学习如何在 Promise、回调和异步 I/O 链路中保留请求上下文，避免把 requestId 层层手动传参。',
  explain: [
    {
      title: '它像异步版 thread-local',
      body: '在传统多线程语言里，thread-local 可以保存当前请求上下文。Node 是异步模型，AsyncLocalStorage 提供类似能力，让上下文跟随异步链路传播。',
    },
    {
      title: 'run 创建上下文边界',
      body: 'asyncLocalStorage.run(store, callback) 会让 callback 内创建的异步操作都能读到同一个 store。离开这条链路后 getStore 返回 undefined 或默认值。',
    },
    {
      title: '适合日志、追踪和租户信息',
      body: 'requestId、traceId、userId、tenantId 这类横切信息适合放进上下文，业务核心参数仍应显式传递，避免隐藏依赖过多。',
    },
    {
      title: '不要用它存大对象',
      body: '上下文会跟随异步生命周期存在。存放大对象、数据库连接或可变复杂状态会增加内存和泄漏风险。',
    },
    {
      title: '框架和库边界要测试',
      body: '大多数现代 Promise 链能传播上下文，但自定义异步桥接、事件封装或老库可能需要额外测试，必要时使用 AsyncResource。',
    },
  ],
  code: `import { AsyncLocalStorage } from 'node:async_hooks';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const requestContext = new AsyncLocalStorage();

function log(message) {
  const store = requestContext.getStore();
  console.log(JSON.stringify({
    message,
    requestId: store?.requestId,
  }));
}

createServer((req, res) => {
  // 每个请求进入自己的上下文，后续 await 和回调能读到 requestId
  requestContext.run({ requestId: randomUUID() }, async () => {
    log('request:start');
    await Promise.resolve();
    log('request:after-await');
    res.end('ok');
  });
}).listen(3000);`,
  review: [
    'AsyncLocalStorage 解决了 requestId 层层传参的什么痛点？',
    '为什么业务核心参数不应该全部藏进上下文？',
    'run 和 getStore 分别负责什么？',
    '上下文里存大对象会有什么风险？',
    '遇到上下文丢失时应该从哪些异步边界排查？',
  ],
  oldNew: {
    old: '每个函数都手动传 requestId，或者日志里根本没有请求关联。',
    new: '用 AsyncLocalStorage 承载横切上下文，但核心业务数据仍显式传递。',
  },
};
