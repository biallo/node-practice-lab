export const lesson = {
  id: 'queues-idempotency',
  title: '队列、后台任务与幂等',
  meta: '工程 · v18+ (2022+)',
  version:
    '真实系统常把慢任务、重试任务和跨服务副作用放进队列。\n队列不是“异步一下就稳了”，它引入 at-least-once 投递、重复消费、延迟、积压和死信处理等新边界。',
  summary: '学习 job queue、retry/backoff、dead letter、幂等 key、任务超时和 at-least-once 语义，设计可靠后台任务。',
  explain: [
    {
      title: '队列削峰但不消除工作',
      body: '队列可以把请求入口和慢任务解耦，也能吸收流量峰值。但任务仍然要执行，积压过大时延迟会变成用户体验问题。',
    },
    {
      title: 'at-least-once 意味着可能重复',
      body: '很多队列保证任务至少被处理一次，而不是恰好一次。消费者必须能处理重复投递、进程崩溃后的重放和部分成功。',
    },
    {
      title: '幂等键保护副作用',
      body: '发送邮件、扣款、创建订单、调用第三方接口都可能重复执行。用 idempotency key 记录处理结果，能让重试变得安全。',
    },
    {
      title: '重试要有退避和上限',
      body: '立即无限重试会放大故障。指数退避、最大次数和死信队列可以避免故障任务堵住正常任务。',
    },
    {
      title: '后台任务也需要观测',
      body: '队列长度、最老任务年龄、成功率、失败率、重试次数和处理耗时都应该被记录，否则后台系统会静默堆积。',
    },
  ],
  code: `const processed = new Map();

async function handleJob(job) {
  if (processed.has(job.idempotencyKey)) {
    return processed.get(job.idempotencyKey);
  }

  try {
    const result = await sendReceiptEmail(job.userId, job.orderId);
    processed.set(job.idempotencyKey, { status: 'sent', result });
    return result;
  } catch (error) {
    const nextAttempt = job.attempt + 1;

    if (nextAttempt > 5) {
      await moveToDeadLetterQueue(job, error);
      return;
    }

    const delayMs = Math.min(60_000, 2 ** nextAttempt * 1_000);
    await enqueue({ ...job, attempt: nextAttempt }, { delayMs });
  }
}`,
  review: [
    '队列削峰后，为什么任务积压仍然是问题？',
    'at-least-once 投递语义对消费者有什么要求？',
    'idempotency key 适合保护哪些副作用？',
    '为什么重试需要退避、上限和死信队列？',
    '后台任务应该观测哪些指标？',
  ],
  oldNew: {
    old: '任务放进队列就可靠了，失败后一直重试就行。',
    new: '队列可靠性来自幂等、退避、死信、超时、积压观测和消费者副作用控制。',
  },
};
