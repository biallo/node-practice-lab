export const lesson = {
  "id": "modules",
  "title": "模块系统：CommonJS 与 ESM",
  "meta": "核心 · v20+",
  "version": "CommonJS 是 Node 早期主流；\nESM 是现代 JavaScript 标准。\n新项目建议优先 ESM，维护旧项目时保留 .cjs 或 require 写法更稳。\nv22/v24 之后 ESM 互操作体验继续改善。",
  "summary": "学会判断模块格式、解析路径、导出形态和包入口，理解为什么现代 Node 项目要把 ESM/CJS 边界设计清楚。",
  "explain": [
    {
      "title": "package.json 的 type 会改变 .js 含义",
      "body": "\"type\": \"module\" 时 .js 按 ESM 解析；没有声明或声明为 commonjs 时 .js 按 CJS 解析。.mjs 永远是 ESM，.cjs 永远是 CJS。"
    },
    {
      "title": "内置模块建议使用 node: 前缀",
      "body": "import { readFile } from \"node:fs/promises\" 能明确表示这是 Node 内置模块，避免和用户安装包重名。"
    },
    {
      "title": "ESM 没有 __dirname",
      "body": "ESM 中用 import.meta.url 表示当前模块 URL，再配合 fileURLToPath 和 dirname 得到文件路径。"
    },
    {
      "title": "exports 字段定义包的公开表面",
      "body": "package.json 的 exports 可以限制外部只能导入指定入口，避免用户依赖内部文件路径。库作者应该把稳定 API 放进 exports，而不是让调用方深度 import 任意文件。"
    },
    {
      "title": "动态 import 是异步边界",
      "body": "import() 返回 Promise，适合按需加载可选依赖、插件或环境相关模块。它不是 require 的一比一替代，因为调用方必须处理异步。"
    },
    {
      "title": "互操作要看默认导出和命名导出",
      "body": "CJS 的 module.exports 导入到 ESM 时经常表现为 default。把老包迁到 ESM 时要明确 API 形态，否则调用方会遇到 default、named export 混乱。"
    }
  ],
  "code": "// package.json 中设置：{ \"type\": \"module\" }\nimport { dirname, join } from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\n// ESM 没有 __filename 和 __dirname，需要自己转换\nconst filename = fileURLToPath(import.meta.url);\nconst currentDir = dirname(filename);\nconsole.log(join(currentDir, 'data.json'));\n\n// 动态 import 适合可选依赖或插件，但它是异步的\nasync function loadFormatter(format) {\n  if (format === 'json') {\n    return import('./formatters/json.js');\n  }\n\n  return import('./formatters/text.js');\n}\n\nconst formatter = await loadFormatter(process.env.REPORT_FORMAT ?? 'text');\nconsole.log(formatter.format({ ok: true }));",
  "review": [
    "为什么新代码推荐 import/export，但老项目不能直接全局替换 require？",
    ".mjs、.cjs、package.json type 分别解决什么问题？",
    "node:fs/promises 和 fs/promises 在表达上有什么差异？",
    "exports 字段为什么会让深度导入失效？这是好事还是坏事？",
    "动态 import 给调用方带来了什么异步成本？"
  ],
  "oldNew": {
    "old": "所有模块都用 require，路径和模块类型靠经验猜。",
    "new": "新项目默认 ESM，旧模块边界用 .cjs 明确保留，内置模块使用 node: 前缀。"
  }
};
