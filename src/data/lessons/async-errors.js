export const lesson = {
  "id": "async-errors",
  "title": "异步、Promise 与错误处理",
  "meta": "核心 · v16+",
  "version": "早期 Node 大量使用 error-first callback；现代 Node 内置模块普遍提供 Promise API。v20 以后写 async/await 已经是主流基础能力。",
  "summary": "从回调迁移到 async/await，理解错误分类、取消、并发失败、错误链和进程级兜底，避免把所有失败都写成一个 catch。",
  "explain": [
    {
      "title": "优先使用 Promise 版本 API",
      "body": "例如 node:fs/promises 的 readFile/writeFile 可以直接 await，错误会以 throw 的形式进入 try/catch。"
    },
    {
      "title": "Error cause 保留底层错误",
      "body": "重新包装错误时使用 new Error(message, { cause })，既能给上层清晰提示，也不丢失底层系统错误。"
    },
    {
      "title": "兜底事件不是业务处理",
      "body": "unhandledRejection 和 uncaughtException 适合记录日志并让进程退出或重启，不适合作为正常业务分支。"
    },
    {
      "title": "错误要分层",
      "body": "参数错误、业务错误、外部服务错误、系统 I/O 错误和程序员错误的处理策略不同。不要把所有错误都变成 500，也不要吞掉程序员错误继续运行。"
    },
    {
      "title": "AbortSignal 是现代取消协议",
      "body": "fetch、timers/promises、部分 fs 和 stream API 支持 AbortSignal。取消不是异常处理的替代品，而是告诉底层操作可以停止工作。"
    },
    {
      "title": "并发失败需要设计",
      "body": "Promise.all 遇到第一个 rejection 就失败；Promise.allSettled 会收集全部结果。批处理、导入任务和并行请求要根据业务选择失败策略。"
    }
  ],
  "code": "import { readFile } from 'node:fs/promises';\nimport { setTimeout as delay } from 'node:timers/promises';\n\nasync function loadJson(fileUrl, signal) {\n  try {\n    // signal 可以把取消意图传给支持 AbortSignal 的底层 API\n    const text = await readFile(fileUrl, { encoding: 'utf8', signal });\n    return JSON.parse(text);\n  } catch (error) {\n    // cause 保存原始错误，方便排查 ENOENT、AbortError 或 JSON 解析失败\n    throw new Error('Failed to load JSON config', { cause: error });\n  }\n}\n\nconst controller = new AbortController();\nconst timeout = delay(3000).then(() => controller.abort());\n\ntry {\n  await Promise.race([loadJson(new URL('./config.json', import.meta.url), controller.signal), timeout]);\n} catch (error) {\n  console.error(error.message, error.cause?.code ?? error.cause?.name);\n}",
  "review": [
    "try/catch 能捕获哪些 await 错误？捕获不到哪些异步错误？",
    "为什么包装错误时不要只 throw new Error(\"failed\")？",
    "Promise.all、Promise.allSettled 和 for...of await 在失败策略上有什么区别？",
    "AbortSignal 取消和 catch 捕获错误分别解决什么问题？",
    "哪些错误应该让进程退出，而不是继续吞掉？"
  ],
  "oldNew": {
    "old": "fs.readFile(path, (err, data) => {}) 层层嵌套。",
    "new": "await readFile(path, \"utf8\")，并用 cause 保留错误链。"
  }
};
