export const lesson = {
  "id": "runtime",
  "title": "Node.js 运行模型",
  "meta": "入门 · v18+ (2022+)",
  "version": "旧版本常把 Node 当成“能跑 JS 的命令行”；\n现代学习要把它看作运行时平台。\nv20/v22/v24 都适合学习事件循环、进程、环境变量和内置模块，v24 LTS 是当前主线。",
  "summary": "先理解 Node.js 的组成、事件循环、任务队列、进程边界和资源成本，后面学习文件、网络、测试和部署才不会只停留在 API 记忆。",
  "explain": [
    {
      "title": "process 是运行时入口",
      "body": "process 代表当前 Node 进程。常用的 process.version、process.cwd()、process.env、process.argv 可以读取版本、工作目录、环境变量和命令行参数。"
    },
    {
      "title": "事件循环不是“并行执行 JS”",
      "body": "JavaScript 主线程一次只执行一段同步代码。文件、网络、计时器等异步任务完成后，会把后续回调排回事件循环。Promise 的微任务通常会在计时器回调前执行。"
    },
    {
      "title": "CPU 密集任务要谨慎",
      "body": "Node 擅长 I/O 密集任务。如果在主线程做大量计算，会阻塞请求处理。后续可以用 Worker Threads、子进程或任务队列拆分。"
    },
    {
      "title": "微任务和 nextTick 的优先级",
      "body": "Promise 回调属于微任务，process.nextTick 有自己的 next tick 队列，并且优先级很高。滥用 nextTick 可能让 I/O 回调迟迟得不到执行。业务代码通常优先用 Promise 和 async/await。"
    },
    {
      "title": "进程是部署和故障边界",
      "body": "Node 服务崩溃时通常是整个进程退出。生产环境依赖进程管理器、容器或平台自动重启，因此代码要清楚何时设置 exitCode、何时优雅关闭、何时让进程失败。"
    },
    {
      "title": "运行时信息用于诊断，不该散落业务逻辑",
      "body": "process.memoryUsage()、process.uptime()、process.resourceUsage() 可以帮助诊断内存和资源，但不要在业务分支里到处依赖这些值。它们更适合健康检查、日志和监控。"
    }
  ],
  "code": "import { setImmediate } from 'node:timers';\n\n// process 提供当前 Node 进程的信息，常用于诊断和启动阶段配置\nconsole.log(process.version);\nconsole.log(process.cwd());\nconsole.log(process.memoryUsage().heapUsed);\n\n// nextTick 优先级很高，适合兼容回调时机，不适合写长递归\nprocess.nextTick(() => console.log('next tick'));\n\n// Promise 微任务通常早于 timer 和 immediate\nPromise.resolve().then(() => console.log('promise microtask'));\nsetTimeout(() => console.log('timer task'), 0);\nsetImmediate(() => console.log('check phase immediate'));\n\nconsole.log('sync task');",
  "review": [
    "process.cwd() 和当前文件所在目录有什么区别？",
    "为什么 Promise.resolve().then(...) 通常会比 setTimeout(..., 0) 更早输出？",
    "process.nextTick 为什么不能被当作普通异步调度工具滥用？",
    "如果一个接口里执行 5 秒 CPU 计算，会对 Node 服务造成什么影响？",
    "进程崩溃、请求失败、业务校验失败分别应该用什么层级处理？"
  ],
  "oldNew": {
    "old": "只会运行 node file.js，遇到异步就靠背回调顺序。",
    "new": "知道 Node 是进程级运行时，能用事件循环、环境变量和内置模块解释程序行为。"
  }
};
