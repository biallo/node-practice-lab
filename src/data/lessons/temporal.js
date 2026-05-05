export const lesson = {
  "id": "temporal",
  "title": "Temporal 与时间处理",
  "meta": "前沿 · v26 Current",
  "version": "Node v26 默认启用 Temporal，这是时间 API 的重大演进。但 v26 是 Current，不等于所有生产环境都已可用；项目采用前要检查目标 Node 版本。",
  "summary": "了解 Temporal 如何拆分日期、时间点、时区和持续时间，知道它适合解决什么问题，以及为什么 v26 Current 特性要谨慎落地。",
  "explain": [
    {
      "title": "Date 混合了多个概念",
      "body": "Date 既表示时间点，又经常被拿来做日期和时区计算。跨时区业务很容易出现“明明是同一天却差一天”的问题。"
    },
    {
      "title": "Temporal 拆分语义",
      "body": "PlainDate 表示日历日期，Instant 表示绝对时间点，ZonedDateTime 表示带时区的日期时间。类型越明确，代码越不容易误解。"
    },
    {
      "title": "前沿特性要有版本判断",
      "body": "课程里需要认识 Temporal，但生产项目应先确认运行环境。LTS 未覆盖时可以考虑 polyfill 或继续使用成熟日期库。"
    },
    {
      "title": "PlainDate 适合日历日期",
      "body": "生日、账单日、节假日不应该被本地时区偏移影响，通常用 PlainDate 表达。它不是某个时间点，而是日历上的一天。"
    },
    {
      "title": "Instant 适合日志和事件时间",
      "body": "日志时间、消息创建时间、审计记录应该使用绝对时间点。Instant 不关心用户所在时区，展示时再转换。"
    },
    {
      "title": "ZonedDateTime 适合真实世界排期",
      "body": "会议、航班、课程开始时间往往需要绑定时区。ZonedDateTime 能表达“纽约时间上午九点”这类业务事实。"
    }
  ],
  "code": "// Node v26 Current 中 Temporal 默认可用\nconst today = Temporal.Now.plainDateISO();\nconst launch = Temporal.PlainDate.from('2026-05-05');\n\n// PlainDate 做日期差值，不会混入本地时区偏移\nconsole.log(today.since(launch).days);\n\nconst createdAt = Temporal.Now.instant();\nconsole.log(createdAt.toString());\n\nconst meeting = Temporal.ZonedDateTime.from({\n  timeZone: 'America/New_York',\n  year: 2026,\n  month: 5,\n  day: 5,\n  hour: 9,\n});\n\n// 展示给用户前再转换时区\nconsole.log(meeting.withTimeZone('Asia/Shanghai').toString());",
  "review": [
    "生日、日志时间、会议时间分别适合 Temporal 的哪个类型？",
    "为什么 new Date(\"2026-05-05\") 可能带来时区误解？",
    "Current 新特性进入生产前需要做哪些版本判断？",
    "PlainDate 和 Instant 的语义差异是什么？",
    "为什么会议时间最好带上明确时区？"
  ],
  "oldNew": {
    "old": "用 Date 处理所有日期、时间点和时区问题。",
    "new": "用 Temporal 明确区分 PlainDate、Instant、ZonedDateTime，旧环境再评估 polyfill。"
  }
};
