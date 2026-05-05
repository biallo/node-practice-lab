import { useEffect, useRef } from 'react';

const baseUrl = import.meta.env.BASE_URL;

export function Sidebar({ activeLesson, completedCount, lessons, onLessonSelect, progress }) {
  const lessonListRef = useRef(null);

  useEffect(() => {
    const list = lessonListRef.current;
    const item = list?.querySelector(`[data-lesson-id="${activeLesson.id}"]`);

    if (!list || !item) return;

    const frame = requestAnimationFrame(() => {
      const listRect = list.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (itemRect.top < listRect.top) {
        list.scrollBy({ top: itemRect.top - listRect.top - 8, behavior: 'smooth' });
      } else if (itemRect.bottom > listRect.bottom) {
        list.scrollBy({ top: itemRect.bottom - listRect.bottom + 8, behavior: 'smooth' });
      }

      if (itemRect.left < listRect.left) {
        list.scrollBy({ left: itemRect.left - listRect.left - 8, behavior: 'smooth' });
      } else if (itemRect.right > listRect.right) {
        list.scrollBy({ left: itemRect.right - listRect.right + 8, behavior: 'smooth' });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [activeLesson.id]);

  return (
    <aside className="sidebar" aria-label="课程列表">
      <a className="brand" href={baseUrl} aria-label="Node Practice Lab 首页">
        <img className="brand-mark" src={`${baseUrl}icons/node-hexagon-card.png`} alt="" />
        <span>
          <strong>Node.js Practice Lab</strong>
          <small>讲解与示例</small>
        </span>
      </a>

      <div className="progress-panel">
        <div className="progress-row">
          <span>课程总览</span>
          <strong>
            {completedCount} / {lessons.length}
          </strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div style={{ width: `${(completedCount / lessons.length) * 100}%` }}></div>
        </div>
        <p>当前：{activeLesson.title}</p>
      </div>

      <label className="mobile-lesson-picker">
        <span>当前课程</span>
        <select value={activeLesson.id} onChange={(event) => onLessonSelect(event.target.value)}>
          {lessons.map((lesson, index) => (
            <option key={lesson.id} value={lesson.id}>
              {String(index + 1).padStart(2, '0')} · {lesson.title}
            </option>
          ))}
        </select>
      </label>

      <nav className="lesson-list" ref={lessonListRef}>
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            className={[
              'lesson-item',
              lesson.id === activeLesson.id ? 'active' : '',
              progress[lesson.id] ? 'completed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            data-lesson-id={lesson.id}
            type="button"
            onClick={() => onLessonSelect(lesson.id)}
          >
            <span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="lesson-copy">
              <strong>{lesson.title}</strong>
              <small>{lesson.meta}</small>
              <span>{lesson.summary}</span>
            </span>
            <span className="lesson-status">{progress[lesson.id] ? '已完成' : '学习中'}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
