import { getCodeTokens, getTokenClass } from '../utils/codeHighlight.js';

export function CodeBlock({ code }) {
  const tokens = getCodeTokens(code);

  return (
    <pre className="code-block">
      <code>
        {tokens.map((token, index) => {
          const className = getTokenClass(token);

          return className ? (
            <span className={className} key={`${token}-${index}`}>
              {token}
            </span>
          ) : (
            <span key={`${token}-${index}`}>{token}</span>
          );
        })}
      </code>
    </pre>
  );
}
