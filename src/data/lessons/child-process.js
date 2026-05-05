export const lesson = {
  id: 'child-process',
  title: 'child_process 与外部命令',
  meta: '实战 · v18+',
  version:
    'child_process 是 Node 长期能力。旧脚本常用 exec 拼 shell 字符串；现代代码更推荐 spawn/execFile 传参数数组，明确 stdout/stderr、退出码、超时和注入风险。',
  summary: '学习 spawn、execFile、退出码、stdio、shell 注入和超时控制，安全地调用 git、ffmpeg、openssl 等外部工具。',
  explain: [
    {
      title: 'spawn 适合长输出和流式处理',
      body: 'spawn 返回 ChildProcess，stdout/stderr 是 stream。处理大量输出或长时间命令时，比 exec 把所有输出缓存到内存更稳。',
    },
    {
      title: 'execFile 避免 shell 解析',
      body: 'execFile 直接执行文件并传入参数数组，不经过 shell 字符串解析，能降低命令注入风险。',
    },
    {
      title: '退出码是协议',
      body: '外部命令成功通常退出码为 0，失败为非 0。Node 调用外部工具时要把 code、signal、stderr 都纳入错误信息。',
    },
    {
      title: '用户输入不能拼命令字符串',
      body: '把用户输入拼进 `rm ${name}` 或 `grep ${query}` 很危险。参数应作为数组传递，并在业务层做白名单或格式校验。',
    },
    {
      title: '超时和取消要显式设计',
      body: '外部命令可能卡住或输出过多。真实服务要设置 timeout、AbortSignal 或主动 kill，并清理临时文件。',
    },
  ],
  code: `import { spawn } from 'node:child_process';

function runGitStatus(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['status', '--short'], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });

    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(\`git failed: code=\${code} signal=\${signal} \${stderr}\`));
    });
  });
}

console.log(await runGitStatus(process.cwd()));`,
  review: [
    'spawn、exec、execFile 分别适合什么场景？',
    '为什么用户输入不能拼进 shell 字符串？',
    '退出码、signal、stderr 应该如何进入错误信息？',
    '外部命令输出很大时为什么不适合 exec？',
    '调用外部工具时需要设计哪些超时和清理策略？',
  ],
  oldNew: {
    old: '用 exec 拼一整段 shell 命令，出错只看 message。',
    new: '优先参数数组和流式输出，明确退出码、stderr、超时、取消和注入边界。',
  },
};
