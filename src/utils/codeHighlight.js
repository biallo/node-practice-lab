const highlightPattern =
  /(\/\/.*|#.*|`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\b(?:import|from|const|let|var|function|async|await|return|try|catch|throw|new|if|else|for|of|class|export|default|finally|if|else)\b|\b(?:process|console|Promise|JSON|Error|Date|Temporal|AbortController|EventEmitter|AsyncLocalStorage|Worker|URL|Number|Math)\b|\b(?:readFile|writeFile|mkdir|rename|createReadStream|createWriteStream|pipeline|createGzip|fetch|setTimeout|setImmediate|clearTimeout|fileURLToPath|dirname|join|randomUUID|randomBytes|createHmac|scrypt|promisify|createServer|spawn|once|delay|run|listen|emit|postMessage|stringify|parse|resolve|reject)\b|\b\d+\b)/g;

const keywordSet = new Set([
  'import',
  'from',
  'const',
  'let',
  'var',
  'function',
  'async',
  'await',
  'return',
  'try',
  'catch',
  'throw',
  'new',
  'if',
  'else',
  'for',
  'of',
  'class',
  'export',
  'default',
  'finally',
]);

const globalSet = new Set([
  'process',
  'console',
  'Promise',
  'JSON',
  'Error',
  'Date',
  'Temporal',
  'AbortController',
  'EventEmitter',
  'AsyncLocalStorage',
  'Worker',
  'URL',
  'Number',
  'Math',
]);
const functionPattern =
  /^(readFile|writeFile|mkdir|rename|createReadStream|createWriteStream|pipeline|createGzip|fetch|setTimeout|setImmediate|clearTimeout|fileURLToPath|dirname|join|randomUUID|randomBytes|createHmac|scrypt|promisify|createServer|spawn|once|delay|run|listen|emit|postMessage|stringify|parse|resolve|reject)$/;

export function getCodeTokens(code) {
  return code.split(highlightPattern).filter(Boolean);
}

export function getTokenClass(token) {
  if (token.startsWith('//') || token.startsWith('#')) return 'token-comment';
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) return 'token-string';
  if (/^\d+$/.test(token)) return 'token-number';
  if (keywordSet.has(token)) return 'token-keyword';
  if (globalSet.has(token)) return 'token-global';
  if (functionPattern.test(token)) return 'token-function';
  return '';
}
