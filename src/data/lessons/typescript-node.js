export const lesson = {
  id: 'typescript-node',
  title: 'TypeScript 与 Node 项目边界',
  meta: '工程 · v18+ (2022+)',
  version:
    'Node 的 ESM、package exports 和 TypeScript 编译选项必须协同设计。\n现代项目要理解类型检查、运行时模块解析、声明文件、路径别名和运行时校验之间的边界。',
  summary: '学习 tsconfig、ESM + TS、moduleResolution、declaration、path alias 陷阱和静态类型与运行时校验的分工。',
  explain: [
    {
      title: '类型检查不等于运行',
      body: 'tsc 能检查类型，也能输出 JS；tsx、ts-node 等工具能开发期直接运行 TS。生产路径要清楚最终运行的是哪个 JS 产物。',
    },
    {
      title: 'ESM 配置要前后一致',
      body: 'package.json 的 type、tsconfig 的 module/moduleResolution、源码 import 扩展名和构建输出目录必须互相匹配。',
    },
    {
      title: '路径别名有运行时成本',
      body: 'TypeScript paths 只影响编译器解析，不会自动改变 Node 运行时解析。使用别名时要有构建器、loader 或 package imports 配合。',
    },
    {
      title: '声明文件是库的用户体验',
      body: '库项目应输出 .d.ts，并让 exports/types 指向稳定入口。类型入口和运行时代码入口不一致会让用户很难排查。',
    },
    {
      title: '静态类型不能校验外部输入',
      body: 'HTTP body、env、JSON 文件和第三方响应在运行时仍是 unknown。TypeScript 要和 schema validation 配合，而不是替代它。',
    },
  ],
  code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*.ts"]
}

// package.json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}`,
  review: [
    'tsc 类型检查和生产运行 JS 之间有什么边界？',
    'ESM + TypeScript 项目为什么要统一 type、module 和 moduleResolution？',
    'TypeScript paths 为什么可能在运行时失效？',
    '库项目为什么要认真维护 declaration 输出？',
    '为什么 TypeScript 不能替代运行时输入校验？',
  ],
  oldNew: {
    old: '用了 TypeScript，Node 项目就自动安全、自动能跑。',
    new: 'TypeScript 需要和 Node 模块解析、构建输出、声明文件和运行时校验一起设计。',
  },
};
