export const lesson = {
  "id": "test-runner",
  "title": "node:test 与工程质量",
  "meta": "工程 · v20+ (2023+)",
  "version": "Node v20 之后内置测试运行器已经足够覆盖很多脚本、库和服务端基础逻辑。\n旧项目常默认 Jest/Mocha；\n新小项目可以先从 node:test 开始。",
  "summary": "用内置 test runner 写断言、异步测试、子测试、mock 和覆盖率，先建立测试思维，再按复杂度选择 Vitest/Jest。",
  "explain": [
    {
      "title": "node:test 是内置测试入口",
      "body": "import test from \"node:test\" 后即可定义测试。配合 node:assert/strict 可以完成常见断言。"
    },
    {
      "title": "异步测试必须 await",
      "body": "测试函数返回 Promise 时，runner 会等待它完成。忘记 await 会造成测试提前结束，出现假通过。"
    },
    {
      "title": "简单项目先内置，复杂项目再升级",
      "body": "需要浏览器模拟、快照、组件测试时再引入 Vitest/Jest。先学内置 runner 能降低概念负担。"
    },
    {
      "title": "子测试适合组织场景",
      "body": "test 回调里的 t.test 可以把同一函数的不同场景分组。场景化测试比一堆平铺测试更容易定位失败原因。"
    },
    {
      "title": "mock 要收敛边界",
      "body": "mock 适合替换时间、随机数、网络或昂贵 I/O。不要 mock 掉所有实现细节，否则测试会只验证 mock 本身。"
    },
    {
      "title": "覆盖率是信号，不是目标",
      "body": "--experimental-test-coverage 可以看到覆盖情况。高覆盖率不等于高质量，关键路径、边界条件和失败分支更重要。"
    }
  ],
  "code": "import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nasync function doubleLater(value) {\n  // 模拟异步行为，真实项目里可能是文件或网络 I/O\n  return Promise.resolve(value * 2);\n}\n\ntest('doubleLater', async (t) => {\n  await t.test('doubles a positive number', async () => {\n    const result = await doubleLater(21);\n    assert.equal(result, 42);\n  });\n\n  await t.test('keeps zero stable', async () => {\n    assert.equal(await doubleLater(0), 0);\n  });\n});\n\n// 运行：node --test --experimental-test-coverage",
  "review": [
    "为什么异步测试里忘记 await 会让测试不可靠？",
    "node --test 和 npm test 分别扮演什么角色？",
    "什么时候内置 test runner 不够用？",
    "子测试比平铺测试多提供了什么表达力？",
    "覆盖率报告应该如何指导补测试，而不是变成数字游戏？"
  ],
  "oldNew": {
    "old": "任何测试都先安装 Jest/Mocha，再配置一堆工具。",
    "new": "先用 node --test 覆盖核心逻辑，再按项目复杂度选择测试框架。"
  }
};
