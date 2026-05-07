export const lesson = {
  id: 'file-upload-multipart',
  title: '文件上传与 multipart',
  meta: '工程 · v18+ (2022+)',
  version:
    '文件上传把 HTTP、Stream、安全和资源清理都揉在一起。\n现代 Node 服务应该流式处理 multipart，限制大小，校验内容，并把临时文件和对象存储上传纳入生命周期管理。',
  summary: '学习 multipart/form-data、上传大小限制、MIME 校验、临时文件清理、流式上传和对象存储边界。',
  explain: [
    {
      title: 'multipart 是表单编码协议',
      body: 'multipart/form-data 用 boundary 分隔字段和文件。不要手写完整解析器，真实项目应使用成熟库并配置限制。',
    },
    {
      title: '上传必须限制大小',
      body: '文件大小、字段数量、文件数量和总请求大小都要有限制。没有限制的上传接口很容易耗尽内存、磁盘或带宽。',
    },
    {
      title: 'MIME 不能只信 header',
      body: 'Content-Type 和文件扩展名都来自客户端，不能完全信任。关键场景要检查文件魔数、重新编码或使用专门扫描服务。',
    },
    {
      title: '临时文件需要清理',
      body: '上传失败、用户取消、进程异常和校验不通过都可能留下临时文件。清理策略应该覆盖成功和失败路径。',
    },
    {
      title: '流式上传保护内存',
      body: '大文件应该边读边写到磁盘或对象存储，而不是读完整 Buffer。pipeline 能统一处理背压和错误传播。',
    },
  ],
  code: `import { createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

async function saveUpload(readable, path, { signal, maxBytes }) {
  let received = 0;

  readable.on('data', (chunk) => {
    received += chunk.length;

    if (received > maxBytes) {
      readable.destroy(new Error('upload too large'));
    }
  });

  try {
    await pipeline(readable, createWriteStream(path), { signal });
    return { path, size: received };
  } catch (error) {
    await rm(path, { force: true });
    throw error;
  }
}`,
  review: [
    'multipart/form-data 为什么不适合手写解析？',
    '上传接口应该限制哪些维度？',
    '为什么不能只相信 Content-Type 或文件扩展名？',
    '上传失败时临时文件为什么容易泄漏？',
    '流式上传相比 Buffer 全量读取有什么优势？',
  ],
  oldNew: {
    old: '文件上传就是把 req body 存成文件。',
    new: '上传接口要处理 multipart 解析、大小限制、内容校验、流式写入、失败清理和对象存储边界。',
  },
};
