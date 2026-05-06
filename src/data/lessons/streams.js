export const lesson = {
  "id": "streams",
  "title": "Buffer、Stream 与 pipeline",
  "meta": "进阶 · v18+",
  "version": "Buffer 和 Stream 是 Node 长期核心能力；\n现代写法更推荐 stream/promises 的 pipeline，错误传播和完成状态都更清楚。",
  "summary": "理解二进制数据、流式处理、背压、Web Streams 互操作和 pipeline 的错误传播，能判断什么时候读全量、什么时候分块处理。",
  "explain": [
    {
      "title": "Buffer 处理二进制数据",
      "body": "图片、压缩包、网络包和加密结果都不是普通字符串。Buffer 是 Node 表达二进制块的基础类型。"
    },
    {
      "title": "Stream 适合大数据和连续数据",
      "body": "Readable 提供数据，Writable 接收数据，Transform 一边读一边改。用流能避免把大文件一次性读进内存。"
    },
    {
      "title": "pipeline 处理错误和背压",
      "body": "pipeline 会把多个流连成管道，并在出错时正确销毁链路。比手写 source.pipe(dest) 更适合生产代码。"
    },
    {
      "title": "背压是内存保护机制",
      "body": "当写入端处理不过来时，读取端应该减速。Stream 的 highWaterMark、write 返回值和 drain 事件共同表达背压。pipeline 会帮你处理大部分细节。"
    },
    {
      "title": "Node Stream 与 Web Stream 正在靠拢",
      "body": "现代 Node 同时支持传统 Node Stream 和 WHATWG Web Streams。fetch 的 response.body 是 Web Stream，很多场景需要知道二者如何转换。"
    },
    {
      "title": "Buffer 编码要明确",
      "body": "Buffer 转字符串必须知道编码。日志和 JSON 常用 utf8；二进制文件不要随意 toString，否则可能破坏数据。"
    }
  ],
  "code": "import { createReadStream, createWriteStream } from 'node:fs';\nimport { Readable } from 'node:stream';\nimport { pipeline } from 'node:stream/promises';\nimport { createGzip } from 'node:zlib';\n\n// 逐块读取 access.log，压缩后写入新文件\n// 不需要把整个日志文件一次性放进内存\nawait pipeline(\n  createReadStream('access.log'),\n  createGzip(),\n  createWriteStream('access.log.gz'),\n);\n\nconst response = await fetch('https://nodejs.org/api/');\n\n// fetch 返回 Web Stream，Readable.fromWeb 可以转成 Node Stream\nawait pipeline(\n  Readable.fromWeb(response.body),\n  createWriteStream('node-api.html'),\n);",
  "review": [
    "什么时候 readFile 会带来内存风险？",
    "Transform stream 可以用来做哪些实际功能？",
    "pipeline 比连续 pipe 调用多解决了什么问题？",
    "背压如何保护内存？",
    "Node Stream 和 Web Stream 分别常出现在什么 API 中？"
  ],
  "oldNew": {
    "old": "source.pipe(gzip).pipe(dest)，错误处理分散且容易漏。",
    "new": "await pipeline(source, gzip, dest)，让完成、失败和背压进入统一流程。"
  }
};
