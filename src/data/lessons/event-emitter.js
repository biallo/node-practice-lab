export const lesson = {
  id: 'event-emitter',
  title: 'EventEmitter 与事件驱动设计',
  meta: '核心 · v18+ (2022+)',
  version:
    'EventEmitter 是 Node 长期核心抽象，流、HTTP server、进程对象都受它影响。\n现代代码仍会用事件，但更强调事件命名、错误事件、once、AbortSignal 和避免监听器泄漏。',
  summary: '理解 on、once、emit、error、removeListener 和事件边界，知道什么时候事件驱动比直接函数调用更合适。',
  explain: [
    {
      title: '事件适合一对多通知',
      body: '当一个动作可能被多个独立模块观察时，事件比硬编码回调更灵活。例如任务完成后同时写日志、更新指标和通知 UI。',
    },
    {
      title: 'error 事件必须被处理',
      body: 'EventEmitter 发出 error 且没有监听器时，Node 会抛出异常并可能让进程退出。库作者和应用层都要明确错误传播策略。',
    },
    {
      title: 'once 表示只关心第一次发生',
      body: '启动完成、连接建立、进程退出等一次性状态适合 once。它能自动移除监听器，降低泄漏风险。',
    },
    {
      title: '监听器泄漏是设计信号',
      body: '同一个 emitter 上不断添加监听器而不清理，可能导致 MaxListenersExceededWarning。它通常提示生命周期边界不清晰。',
    },
    {
      title: '事件名是公共协议',
      body: '库暴露事件时，事件名和 payload 结构就是 API。随意改名或改变 payload 会破坏调用方。',
    },
  ],
  code: `import { EventEmitter, once } from 'node:events';

class JobQueue extends EventEmitter {
  async run(job) {
    this.emit('job:start', { id: job.id });

    try {
      const result = await job.execute();
      this.emit('job:done', { id: job.id, result });
    } catch (error) {
      // error 事件必须有人监听，否则可能导致进程异常退出
      this.emit('error', error);
    }
  }
}

const queue = new JobQueue();

queue.on('error', (error) => {
  console.error('job failed', error);
});

queue.on('job:start', ({ id }) => console.log('start', id));

// once 返回 Promise，适合等待第一次完成
const donePromise = once(queue, 'job:done');
queue.run({ id: 'import-users', execute: async () => 42 });
console.log(await donePromise);`,
  review: [
    'EventEmitter 比直接调用回调多解决了什么问题？',
    '为什么 error 事件没有监听器时很危险？',
    'once 适合哪些只发生一次的生命周期事件？',
    'MaxListenersExceededWarning 通常说明什么设计问题？',
    '事件 payload 为什么应该被当作 API 设计？',
  ],
  oldNew: {
    old: '把事件当成随便 emit 字符串的工具，错误和清理靠运气。',
    new: '把事件名、payload、错误事件和监听器生命周期都当作稳定协议设计。',
  },
};
