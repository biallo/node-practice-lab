export const lesson = {
  "id": "http-fetch",
  "title": "HTTP 服务与 fetch",
  "meta": "必修 · v20+",
  "version": "过去常装 request、node-fetch、axios；\n现代 Node 已内置 fetch，底层由 Undici 驱动。\nNode v26 使用 Undici 8，但生产仍建议以 LTS 行为为准。",
  "summary": "同时理解服务端请求处理和客户端请求发送，知道状态码、header、body、超时、取消、连接复用和 streaming response。",
  "explain": [
    {
      "title": "node:http 是框架的底层概念",
      "body": "Express、Fastify 等框架会包装请求和响应，但你仍然要理解 method、url、headers、statusCode 和 body。"
    },
    {
      "title": "fetch 遇到 404 不会自动 throw",
      "body": "网络失败会 reject，但 HTTP 404/500 仍是成功收到响应。需要自己检查 response.ok 或 response.status。"
    },
    {
      "title": "AbortController 管理超时",
      "body": "fetch 没有 timeout 参数。可以用 AbortController 在指定时间后中断请求。"
    },
    {
      "title": "请求体只能消费一次",
      "body": "response.json()、response.text()、request body stream 都会消费 body。读取前要决定格式，调试时不要一边 text 一边 json。"
    },
    {
      "title": "连接复用影响吞吐",
      "body": "Node 的 fetch 由 Undici 驱动，连接池、keep-alive 和代理配置会影响高并发出站请求。小脚本可以直接 fetch，服务端要考虑全局 dispatcher 和超时策略。"
    },
    {
      "title": "服务端响应也可以流式发送",
      "body": "下载、日志、SSE 和大 JSON 导出不一定要一次性生成完整 body。理解 stream 能让 HTTP 服务更省内存。"
    }
  ],
  "code": "const controller = new AbortController();\n\n// 3 秒后主动取消请求，避免一直等待\nconst timer = setTimeout(() => controller.abort(), 3000);\n\ntry {\n  const response = await fetch('https://nodejs.org/api/', {\n    signal: controller.signal,\n  });\n\n  // 404/500 不会自动抛错，需要显式判断\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n\n  console.log(await response.text());\n} finally {\n  clearTimeout(timer);\n}",
  "review": [
    "fetch 在什么情况下会 reject？什么情况下只返回非 ok response？",
    "AbortController 为什么比 Promise.race 更适合取消请求？",
    "学习框架前为什么还要理解 node:http？",
    "为什么 response body 不能反复读取？",
    "高并发出站请求为什么需要连接池和超时策略？"
  ],
  "oldNew": {
    "old": "任何 HTTP 请求都先安装第三方客户端库。",
    "new": "先掌握内置 fetch；需要重试、代理、连接池策略时再选择专门库。"
  }
};
