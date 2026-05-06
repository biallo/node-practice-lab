export const lesson = {
  id: 'cli-stdio-signals',
  title: 'CLI、stdio 与进程信号',
  meta: '工程 · v18+',
  version:
    'Node 很早就适合写命令行工具；\n现代 CLI 更强调可组合的 stdio、清晰的退出码、可取消任务和优雅处理 SIGINT/SIGTERM。\n脚本不只是“本地能跑”，也应该能被 CI、shell 管道和自动化系统可靠调用。',
  summary: '学习 argv、stdin/stdout/stderr、exitCode、shebang、信号处理和优雅退出，写出可组合、可自动化的 Node CLI。',
  explain: [
    {
      title: 'argv 是命令入口协议',
      body: 'process.argv 包含 node 路径、脚本路径和用户参数。真实 CLI 通常会把参数解析、默认值、help 输出和错误提示设计成稳定协议。',
    },
    {
      title: 'stdout 和 stderr 要分工',
      body: 'stdout 应输出机器可继续处理的数据，stderr 输出进度、警告和错误。这样命令才能安全地参与管道、重定向和 CI 日志。',
    },
    {
      title: '退出码表达结果',
      body: '0 表示成功，非 0 表示失败。优先设置 process.exitCode，让事件循环自然收尾；只有在必须立刻终止时才调用 process.exit()。',
    },
    {
      title: '信号是外部取消请求',
      body: 'SIGINT 常来自 Ctrl+C，SIGTERM 常来自进程管理器或容器平台。收到信号后应停止接收新任务、清理资源并尽快退出。',
    },
    {
      title: 'stdin 让 CLI 可组合',
      body: '支持从 stdin 读取数据，能让工具接在 cat、grep、curl 等命令后面。命令行工具越可组合，越适合自动化。',
    },
  ],
  code: `#!/usr/bin/env node
import { stdin, stdout, stderr } from 'node:process';

let stopping = false;

process.once('SIGINT', () => {
  stopping = true;
  process.exitCode = 130;
  stderr.write('\\nreceived SIGINT, finishing current input...\\n');
});

const chunks = [];

for await (const chunk of stdin) {
  if (stopping) break;
  chunks.push(chunk);
}

try {
  const input = Buffer.concat(chunks).toString('utf8').trim();
  const result = input.toUpperCase();

  stdout.write(result + '\\n');
} catch (error) {
  process.exitCode = 1;
  stderr.write(\`cli failed: \${error.message}\\n\`);
}`,
  review: [
    'stdout 和 stderr 为什么不应该混用？',
    'process.exitCode 和 process.exit() 的差异是什么？',
    'SIGINT 和 SIGTERM 分别常来自哪里？',
    '为什么支持 stdin 能提升 CLI 的可组合性？',
    '命令行工具的非 0 退出码对 CI 有什么意义？',
  ],
  oldNew: {
    old: 'Node 脚本只要 console.log 出结果就行。',
    new: '可靠 CLI 要把参数、stdio、退出码、信号和资源清理当成对外协议。',
  },
};
