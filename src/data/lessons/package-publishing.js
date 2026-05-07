export const lesson = {
  id: 'package-publishing',
  title: '包发布、SemVer 与库边界',
  meta: '进阶 · v18+ (2022+)',
  version:
    '现代 npm 包不只是上传一个入口文件；\n库作者需要设计 exports、types、SemVer、peerDependencies、发布文件范围和供应链安全，避免用户在升级时踩到隐藏边界。',
  summary: '学习库发布的公开 API、conditional exports、SemVer、peerDependencies、files、types 和 npm 发布安全。',
  explain: [
    {
      title: 'exports 是公开 API 合同',
      body: 'exports 明确哪些路径可以被导入。没有暴露的内部文件不应被用户依赖，这能让库在重构时保留更清晰的兼容边界。',
    },
    {
      title: 'SemVer 表达升级风险',
      body: 'patch 修 bug，minor 加兼容能力，major 允许破坏性变化。版本号是给使用者和自动化升级工具看的风险信号。',
    },
    {
      title: 'peerDependencies 表达宿主约束',
      body: '插件、框架适配器和 UI 组件库常用 peerDependencies 表示“我需要宿主项目提供这个包”，避免重复安装多份不兼容实例。',
    },
    {
      title: 'files 控制发布内容',
      body: 'npm 包默认可能包含不必要文件。用 files、.npmignore 和 npm pack 预览发布包，能减少体积和意外泄露。',
    },
    {
      title: '类型声明也是 API',
      body: 'TypeScript 声明、JSDoc 类型和 package.json 的 types 字段会影响用户体验。类型破坏有时也是破坏性变更。',
    },
  ],
  code: `{
  "name": "@acme/logger",
  "version": "1.4.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./testing": {
      "types": "./dist/testing.d.ts",
      "import": "./dist/testing.js"
    }
  },
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "peerDependencies": {
    "pino": "^9.0.0"
  }
}

# 发布前先看最终包内容
npm pack --dry-run`,
  review: [
    'exports 为什么能减少用户依赖内部路径的风险？',
    'SemVer 的 patch、minor、major 分别传达什么？',
    'peerDependencies 适合表达什么关系？',
    '为什么发布前要运行 npm pack --dry-run？',
    '类型声明发生破坏时，为什么也可能需要 major 版本？',
  ],
  oldNew: {
    old: 'npm publish 只要 dist 里有代码就行。',
    new: '发布包是在维护公开协议：入口、类型、版本、宿主依赖、文件范围和供应链安全都要明确。',
  },
};
