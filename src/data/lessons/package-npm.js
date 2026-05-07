export const lesson = {
  id: 'package-npm',
  title: 'package.json、npm 与依赖边界',
  meta: '工程 · v18+ (2022+)',
  version:
    '旧项目常把 package.json 当成“能 npm install 就行”的清单；\n现代 Node 项目要理解 scripts、dependencies、devDependencies、engines、exports、lockfile 和 npm ci 的协作。\nNode v20/v22/v24 项目都应把可重复安装和发布边界作为基础工程能力。',
  summary: '掌握包元数据、脚本、依赖类型、lockfile、npm ci、engines 和发布入口，避免项目在本地能跑、CI 或生产却失败。',
  explain: [
    {
      title: 'scripts 是项目命令协议',
      body: 'npm scripts 把开发、测试、构建、预览、发布等命令固定下来。团队不应该靠口头约定运行 node scripts/build.js，而应该通过 npm run build 暴露稳定入口。',
    },
    {
      title: 'dependencies 和 devDependencies 是部署边界',
      body: '运行时必须依赖放 dependencies，构建、测试、lint 等开发工具放 devDependencies。部署环境如果只安装生产依赖，放错位置会导致运行时缺包。',
    },
    {
      title: 'lockfile 保证可重复安装',
      body: 'package-lock.json 记录完整依赖树和版本。CI 中使用 npm ci 会严格按 lockfile 安装，并在 package.json 与 lockfile 不一致时失败。',
    },
    {
      title: 'engines 表达运行时要求',
      body: 'engines.node 可以提示项目需要的 Node 版本。它不是所有环境都会强制执行，但能帮助协作者、CI 和部署平台尽早发现版本不匹配。',
    },
    {
      title: 'exports 控制包的公开 API',
      body: '库项目应该用 exports 暴露稳定入口，避免用户依赖内部目录结构。应用项目也能借此理解为什么某些深度导入会在升级后失效。',
    },
  ],
  code: `{
  "name": "node-practice-lab",
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "vite",
    "test": "node --test",
    "build": "vite build"
  },
  "dependencies": {
    "fastify": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^8.0.10"
  }
}

# CI 中优先使用 npm ci，它会严格读取 lockfile
npm ci
npm test
npm run build`,
  review: [
    'npm install 和 npm ci 在 CI 中的行为差异是什么？',
    '运行时依赖误放到 devDependencies 会带来什么部署风险？',
    'engines.node 解决什么问题，又不能保证什么？',
    '库项目为什么要用 exports 限制公开入口？',
    'scripts 为什么是团队协作协议，而不只是快捷命令？',
  ],
  oldNew: {
    old: 'package.json 只是装包后自动生成的文件，能启动项目就不管。',
    new: 'package.json 是项目协议：描述运行时、命令、依赖边界、公开 API 和可重复安装策略。',
  },
};
