import { CodeBlock } from './CodeBlock.jsx';

export function LessonContent({ isDone, lesson, onDone, tab }) {
  if (tab === 'review') {
    return <ReviewContent isDone={isDone} lesson={lesson} onDone={onDone} />;
  }

  return <ExplainContent lesson={lesson} />;
}

function ExplainContent({ lesson }) {
  return (
    <section className="content-grid" role="tabpanel">
      <article className="panel wide version-note">
        <div className="section-title">
          <strong>Evolution</strong>
          <h2>版本演进</h2>
        </div>
        <p>{lesson.version}</p>
      </article>

      <article className="panel">
        <div className="section-title">
          <span>Features</span>
          <h2>方法与特性</h2>
        </div>
        <div className="feature-list">
          {lesson.explain.map((item) => (
            <section className="feature-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </section>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="section-title">
          <span>Code</span>
          <h2>代码示例</h2>
        </div>
        <div className="code-panel">
          <CodeBlock code={lesson.code} />
        </div>
      </article>
    </section>
  );
}

function ReviewContent({ isDone, lesson, onDone }) {
  return (
    <section className="content-grid" role="tabpanel">
      <article className="panel">
        <div className="section-title">
          <span>Compare</span>
          <h2>旧认知 / 新认知</h2>
        </div>
        <div className="compare-grid">
          <section>
            <strong>旧认知</strong>
            <p>{lesson.oldNew.old}</p>
          </section>
          <section>
            <strong>新认知</strong>
            <p>{lesson.oldNew.new}</p>
          </section>
        </div>
      </article>

      <article className="panel">
        <div className="section-title">
          <span>Review</span>
          <h2>复盘</h2>
        </div>
        <ol className="checklist">
          {lesson.review.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <button className={isDone ? 'complete-button done' : 'complete-button'} type="button" onClick={onDone} disabled={isDone}>
          {isDone ? '已完成' : '完成课程'}
        </button>
      </article>
    </section>
  );
}
