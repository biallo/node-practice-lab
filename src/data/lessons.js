import { lesson as runtime } from './lessons/runtime.js';
import { lesson as modules } from './lessons/modules.js';
import { lesson as packageNpm } from './lessons/package-npm.js';
import { lesson as cliStdioSignals } from './lessons/cli-stdio-signals.js';
import { lesson as asyncErrors } from './lessons/async-errors.js';
import { lesson as fsPathUrl } from './lessons/fs-path-url.js';
import { lesson as streams } from './lessons/streams.js';
import { lesson as eventEmitter } from './lessons/event-emitter.js';
import { lesson as networkCore } from './lessons/network-core.js';
import { lesson as httpFetch } from './lessons/http-fetch.js';
import { lesson as httpServer } from './lessons/http-server.js';
import { lesson as httpProduction } from './lessons/http-production.js';
import { lesson as validationBoundaries } from './lessons/validation-boundaries.js';
import { lesson as configEnv } from './lessons/config-env.js';
import { lesson as timersAbort } from './lessons/timers-abort.js';
import { lesson as libuvThreadpool } from './lessons/libuv-threadpool.js';
import { lesson as testRunner } from './lessons/test-runner.js';
import { lesson as securityPermission } from './lessons/security-permission.js';
import { lesson as cacheLifecycle } from './lessons/cache-lifecycle.js';
import { lesson as asyncLocalStorage } from './lessons/async-local-storage.js';
import { lesson as workerThreads } from './lessons/worker-threads.js';
import { lesson as childProcess } from './lessons/child-process.js';
import { lesson as cryptoWebcrypto } from './lessons/crypto-webcrypto.js';
import { lesson as packagePublishing } from './lessons/package-publishing.js';
import { lesson as temporal } from './lessons/temporal.js';
import { lesson as diagnostics } from './lessons/diagnostics.js';
import { lesson as performanceProfiling } from './lessons/performance-profiling.js';
import { lesson as observabilityOtel } from './lessons/observability-otel.js';
import { lesson as databaseTransactions } from './lessons/database-transactions.js';
import { lesson as queuesIdempotency } from './lessons/queues-idempotency.js';
import { lesson as authCookieSession } from './lessons/auth-cookie-session.js';
import { lesson as realtimeWebsocketSse } from './lessons/realtime-websocket-sse.js';
import { lesson as fileUploadMultipart } from './lessons/file-upload-multipart.js';
import { lesson as typescriptNode } from './lessons/typescript-node.js';
import { lesson as deploymentContainers } from './lessons/deployment-containers.js';

export const lessons = [
  // Node v16 and earlier mental model carried into modern LTS.
  asyncErrors,
  eventEmitter,
  cliStdioSignals,
  childProcess,

  // Node v18 baseline: broadly available platform capabilities.
  runtime,
  libuvThreadpool,
  fsPathUrl,
  streams,
  networkCore,
  httpServer,
  httpProduction,
  timersAbort,
  workerThreads,
  cryptoWebcrypto,
  validationBoundaries,
  cacheLifecycle,
  packageNpm,
  packagePublishing,
  diagnostics,
  performanceProfiling,
  observabilityOtel,
  databaseTransactions,
  queuesIdempotency,
  authCookieSession,
  realtimeWebsocketSse,
  fileUploadMultipart,
  typescriptNode,
  deploymentContainers,

  // Node v20 baseline: modern project defaults and built-in tooling.
  modules,
  httpFetch,
  configEnv,
  testRunner,
  securityPermission,

  // Node v22/v24 line: production-era context and newer runtime improvements.
  asyncLocalStorage,

  // Node v26 Current: useful to learn, but not the default production target.
  temporal,
];
