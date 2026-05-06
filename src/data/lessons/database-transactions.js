export const lesson = {
  id: 'database-transactions',
  title: '数据库、事务与连接池',
  meta: '工程 · v18+',
  version:
    'Node 本身不绑定数据库，但真实服务几乎一定要面对连接池、事务、迁移、超时和一致性边界。\n现代后端能力不是会调用 query，而是知道数据操作失败、重试和并发冲突时系统会怎样。',
  summary: '学习连接池、事务、migration、prepared statement、超时、重试和幂等，理解 Node 与数据库之间的工程边界。',
  explain: [
    {
      title: '连接池控制数据库压力',
      body: '每个请求新建连接成本高且容易压垮数据库。连接池复用连接，但池大小要结合数据库容量、实例数量和请求并发一起设计。',
    },
    {
      title: '事务保护一组写入',
      body: '多个写操作必须一起成功或一起失败时使用事务。事务里要避免长时间等待外部服务，否则会占用锁和连接。',
    },
    {
      title: '迁移是结构变更协议',
      body: 'schema migration 应该可审计、可回滚或可前滚。应用发布和数据库变更要考虑兼容窗口，避免新旧代码同时运行时崩溃。',
    },
    {
      title: '参数化查询防注入',
      body: 'SQL 字符串拼接用户输入会带来注入风险。prepared statement 或参数化查询让数据和值的边界更明确。',
    },
    {
      title: '重试要理解副作用',
      body: '读请求和可幂等写入更适合重试。已经部分成功的写操作如果没有幂等键，盲目重试可能造成重复扣款、重复发货或重复通知。',
    },
  ],
  code: `async function transfer(pool, fromId, toId, cents) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [cents, fromId],
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [cents, toId],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}`,
  review: [
    '连接池大小为什么不能只看单个 Node 进程？',
    '事务里为什么不应该等待慢外部接口？',
    'migration 为什么要考虑新旧代码共存？',
    '参数化查询如何降低 SQL 注入风险？',
    '哪些数据库操作可以安全重试，哪些需要幂等键？',
  ],
  oldNew: {
    old: '数据库就是 await query，失败了 catch 后重试。',
    new: '数据库访问要设计池容量、事务边界、结构迁移、参数化查询、超时和副作用安全。',
  },
};
