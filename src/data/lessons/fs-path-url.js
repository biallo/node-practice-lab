export const lesson = {
  "id": "fs-path-url",
  "title": "文件系统、路径与 URL",
  "meta": "必修 · v18+",
  "version": "fs/promises 在现代 Node 中非常成熟。\n旧代码常依赖 process.cwd() 和字符串拼接；\n现代代码更强调 URL、path、跨平台路径和目录边界校验。",
  "summary": "掌握读取、写入、创建目录、JSON 格式化、原子写入和路径边界校验，避免脚本在不同工作目录或不同系统上失效。",
  "explain": [
    {
      "title": "模块相对资源使用 import.meta.url",
      "body": "new URL(\"./file.json\", import.meta.url) 基于当前模块定位文件，不受命令从哪个目录执行影响。"
    },
    {
      "title": "用户路径先 resolve 再校验",
      "body": "用户输入路径可能包含 ../。服务端处理路径时要 resolve 到绝对路径，再确认它仍在允许目录内。"
    },
    {
      "title": "写 JSON 时保持可读",
      "body": "JSON.stringify(data, null, 2) 会输出带缩进的 JSON，适合配置文件和学习项目。"
    },
    {
      "title": "原子写入减少半文件风险",
      "body": "直接覆盖目标文件时，进程崩溃可能留下半个文件。更稳的做法是先写临时文件，再 rename 到目标路径；同一文件系统内 rename 通常是原子的。"
    },
    {
      "title": "stat 和 access 不要替代真实操作",
      "body": "先 access 再 readFile 可能有竞态条件：检查后文件状态可能变化。多数场景直接执行读写并处理错误更可靠。"
    },
    {
      "title": "文件监听要考虑平台差异",
      "body": "fs.watch 在不同平台的事件粒度不完全一致。构建工具通常会用 chokidar 这类库封装差异；学习底层时要知道 watch 不是数据库级事件流。"
    }
  ],
  "code": "import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';\n\nconst dataDir = new URL('../data/', import.meta.url);\nconst profileFile = new URL('profile.json', dataDir);\nconst tempFile = new URL('profile.json.tmp', dataDir);\n\n// recursive: true 表示目录已存在也不会报错\nawait mkdir(dataDir, { recursive: true });\n\nlet profile = {};\ntry {\n  profile = JSON.parse(await readFile(profileFile, 'utf8'));\n} catch (error) {\n  // ENOENT 表示第一次运行还没有文件，其他错误继续抛出\n  if (error.code !== 'ENOENT') throw error;\n}\n\nprofile.updatedAt = new Date().toISOString();\n\n// 先写临时文件，再 rename，降低写到一半崩溃造成坏文件的概率\nawait writeFile(tempFile, JSON.stringify(profile, null, 2));\nawait rename(tempFile, profileFile);",
  "review": [
    "process.cwd() 和 import.meta.url 定位资源时有什么差别？",
    "为什么用户上传文件名不能直接拼进路径？",
    "mkdir 的 recursive: true 适合解决什么问题？",
    "为什么“先判断文件是否存在再读取”仍可能有竞态条件？",
    "临时文件 + rename 为什么比直接覆盖更稳？"
  ],
  "oldNew": {
    "old": "const file = \"./data/profile.json\"，从不同目录执行就可能失败。",
    "new": "模块内资源用 import.meta.url，用户输入路径做 normalize/resolve 和边界校验。"
  }
};
