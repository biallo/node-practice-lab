export const lesson = {
  id: 'cache-lifecycle',
  title: '缓存、连接池与资源生命周期',
  meta: '工程 · v18+ (2022+)',
  version:
    '缓存和池化能提升性能，也会制造陈旧数据、内存增长和关闭困难。\n现代 Node 服务需要理解 TTL、LRU、连接复用、句柄释放和后台任务清理。',
  summary: '学习 in-memory cache、TTL、LRU、连接池、文件句柄、定时器和 AbortSignal 的生命周期管理。',
  explain: [
    {
      title: '缓存需要失效策略',
      body: '没有 TTL、容量限制或主动失效的缓存，本质上可能是内存泄漏。缓存命中率和数据新鲜度要一起考虑。',
    },
    {
      title: 'LRU 保护内存上限',
      body: 'LRU 会优先淘汰最近最少使用的数据，适合防止 key 空间无限增长。简单 Map 只有在 key 数量可控时才安全。',
    },
    {
      title: '连接池也是共享资源',
      body: '数据库、HTTP agent 和外部客户端常维护连接池。池太小会排队，太大会压垮下游或耗尽本机资源。',
    },
    {
      title: '句柄决定进程能否退出',
      body: '未关闭的 server、socket、file handle、timer 和 watcher 都可能让进程保持存活。测试和 CLI 尤其容易暴露这类问题。',
    },
    {
      title: '后台任务要能取消',
      body: '轮询、重试和批处理任务应该接受 AbortSignal 或关闭信号，避免部署、测试或用户取消后继续工作。',
    },
  ],
  code: `const cache = new Map();
const maxEntries = 100;
const ttlMs = 30_000;

function getCached(key, loadValue) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    cache.delete(key);
    cache.set(key, cached);
    return cached.value;
  }

  const value = loadValue();
  cache.set(key, { value, expiresAt: now + ttlMs });

  while (cache.size > maxEntries) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  return value;
}

const interval = setInterval(() => {
  const now = Date.now();

  for (const [key, item] of cache) {
    if (item.expiresAt <= now) cache.delete(key);
  }
}, ttlMs).unref();`,
  review: [
    '为什么没有上限的 Map 缓存可能变成内存泄漏？',
    'TTL 和 LRU 分别解决什么问题？',
    '连接池过大或过小分别有什么风险？',
    '哪些资源句柄会阻止 Node 进程退出？',
    '后台任务为什么应该支持取消或关闭？',
  ],
  oldNew: {
    old: '缓存就是用 Map 存一下，连接池越大越快。',
    new: '缓存和池化都是资源管理问题，必须设计容量、失效、下游压力和关闭流程。',
  },
};
