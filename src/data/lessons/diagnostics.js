export const lesson = {
  "id": "diagnostics",
  "title": "诊断、性能与发布",
  "meta": "工程 · v18+ (2022+)",
  "version": "Node 的诊断能力一直在增强。\n生产版本选择上，Current 适合试新能力，Active LTS/Maintenance LTS 更适合真实服务。",
  "summary": "建立可观察性意识：结构化日志、耗时、内存、CPU、诊断通道、健康检查、CI 构建和版本策略。",
  "explain": [
    {
      "title": "日志要结构化",
      "body": "结构化日志比随手 console.log 更容易搜索、聚合和告警。至少包含 event、duration、status、requestId 等字段。"
    },
    {
      "title": "performance 测量关键耗时",
      "body": "node:perf_hooks 提供 performance.now() 等能力，适合测量任务执行耗时。"
    },
    {
      "title": "发布选择 LTS 更稳",
      "body": "生产服务通常选择 Active LTS 或 Maintenance LTS。Current 可以用于本地试验和提前迁移验证。"
    },
    {
      "title": "diagnostics_channel 适合库和基础设施",
      "body": "diagnostics_channel 可以让库发布诊断事件，而不强耦合到具体日志库。应用层可以订阅这些事件并接入自己的观测系统。"
    },
    {
      "title": "健康检查要区分存活和就绪",
      "body": "liveness 关注进程是否还活着，readiness 关注服务是否能接请求。数据库断开时，服务可能还活着但不应该接流量。"
    },
    {
      "title": "问题定位先分层",
      "body": "CPU 高、内存涨、I/O 慢、外部服务慢、事件循环延迟高是不同问题。优化前先归因，不要盲目改代码。"
    }
  ],
  "code": "import diagnosticsChannel from 'node:diagnostics_channel';\nimport { performance } from 'node:perf_hooks';\n\nconst jobChannel = diagnosticsChannel.channel('app.job');\nconst start = performance.now();\n\ntry {\n  // runJob 代表真实业务任务，例如生成报告或同步数据\n  await runJob();\n  jobChannel.publish({ status: 'ok' });\n} catch (error) {\n  jobChannel.publish({ status: 'error', error });\n  throw error;\n} finally {\n  const durationMs = Math.round(performance.now() - start);\n\n  // 结构化日志方便后续被日志平台解析\n  console.log(JSON.stringify({\n    event: 'job.done',\n    durationMs,\n    node: process.version,\n    uptime: process.uptime(),\n  }));\n}",
  "review": [
    "为什么生产不建议无脑跟随 Current？",
    "内存泄漏、CPU 飙升、I/O 慢分别应该先看什么信号？",
    "npm ci 为什么更适合 CI 环境？",
    "diagnostics_channel 为什么更适合库和基础设施代码？",
    "liveness 和 readiness 为什么不应该混成一个接口？"
  ],
  "oldNew": {
    "old": "上线后靠临时 console.log 排查问题。",
    "new": "上线前就准备日志、指标、测试、构建和可回滚策略。"
  }
};
