import { lesson as runtime } from './lessons/runtime.js';
import { lesson as modules } from './lessons/modules.js';
import { lesson as packageNpm } from './lessons/package-npm.js';
import { lesson as asyncErrors } from './lessons/async-errors.js';
import { lesson as fsPathUrl } from './lessons/fs-path-url.js';
import { lesson as streams } from './lessons/streams.js';
import { lesson as eventEmitter } from './lessons/event-emitter.js';
import { lesson as httpFetch } from './lessons/http-fetch.js';
import { lesson as httpServer } from './lessons/http-server.js';
import { lesson as configEnv } from './lessons/config-env.js';
import { lesson as timersAbort } from './lessons/timers-abort.js';
import { lesson as testRunner } from './lessons/test-runner.js';
import { lesson as securityPermission } from './lessons/security-permission.js';
import { lesson as asyncLocalStorage } from './lessons/async-local-storage.js';
import { lesson as workerThreads } from './lessons/worker-threads.js';
import { lesson as childProcess } from './lessons/child-process.js';
import { lesson as cryptoWebcrypto } from './lessons/crypto-webcrypto.js';
import { lesson as temporal } from './lessons/temporal.js';
import { lesson as diagnostics } from './lessons/diagnostics.js';

export const lessons = [
  runtime,
  modules,
  packageNpm,
  asyncErrors,
  fsPathUrl,
  streams,
  eventEmitter,
  httpFetch,
  httpServer,
  configEnv,
  timersAbort,
  testRunner,
  securityPermission,
  asyncLocalStorage,
  workerThreads,
  childProcess,
  cryptoWebcrypto,
  temporal,
  diagnostics,
];
