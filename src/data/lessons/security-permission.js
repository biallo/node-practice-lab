export const lesson = {
  "id": "security-permission",
  "title": "权限模型与安全边界",
  "meta": "现代 · v20+",
  "version": "权限模型从实验特性逐步走向更实用。它不是万能沙箱，但代表 Node 从“默认拥有全部能力”向“显式声明能力”演进。",
  "summary": "理解 --permission、文件/网络/子进程/worker 权限、输入校验、供应链和 secret 管理，知道它是安全带而不是沙箱。",
  "explain": [
    {
      "title": "权限模型限制运行时能力",
      "body": "--permission 可以限制文件系统、子进程、worker 等能力。脚本需要读写指定路径时再通过 --allow-* 明确放行。"
    },
    {
      "title": "不要执行未经校验的用户输入",
      "body": "child_process 很强也很危险。把用户输入拼进 shell 命令容易造成命令注入。"
    },
    {
      "title": "依赖安全是持续过程",
      "body": "npm audit 能发现已知漏洞，但不能替代代码审查、锁文件、最小依赖和 secret 管理。"
    },
    {
      "title": "运行时 API 可以检查权限",
      "body": "启用权限模型后，process.permission.has(scope, reference) 可以在运行时检查是否有某类访问能力，用于给出更友好的错误提示。"
    },
    {
      "title": "网络和子进程默认都应谨慎",
      "body": "允许网络、child_process、worker_threads 都会扩大攻击面。脚本需要什么就开放什么，不要为了省事一口气放开所有权限。"
    },
    {
      "title": "secret 不属于源码",
      "body": "API key、数据库密码、私钥应来自环境变量、secret manager 或部署平台。示例配置可以提交，真实 secret 不应该进入 Git 历史。"
    }
  ],
  "code": "# 只允许读取 ./data，脚本读取其他路径会被拒绝\nnode --permission --allow-fs-read=./data scripts/report.mjs\n\n# 允许读取 data，同时允许写入 dist\nnode --permission \\\n  --allow-fs-read=./data \\\n  --allow-fs-write=./dist \\\n  scripts/build-report.mjs\n\n// 脚本内部也可以给出更清晰的权限提示\nif (process.permission && !process.permission.has('fs.write', './dist')) {\n  throw new Error('This report needs write access to ./dist');\n}",
  "review": [
    "权限模型为什么不能替代登录鉴权和业务权限？",
    "把用户输入拼进 shell 命令会有什么风险？",
    "为什么 lockfile、audit 和最小依赖要一起看？",
    "process.permission.has 适合用来做什么，不适合用来做什么？",
    "为什么 secret 泄露到 Git 历史后，删除文件还不够？"
  ],
  "oldNew": {
    "old": "本地脚本默认能读写整台机器，能启动任意子进程。",
    "new": "敏感脚本显式声明权限，部署时结合容器、secret 管理和最小权限。"
  }
};
