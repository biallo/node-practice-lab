import { useEffect, useMemo, useState } from 'react';
import { LessonContent } from './components/LessonContent.jsx';
import { LessonHeader } from './components/LessonHeader.jsx';
import { LessonTabs } from './components/LessonTabs.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { lessons } from './data/lessons.js';
import {
  loadActiveLessonId,
  loadProgress,
  saveActiveLessonId,
  saveProgress,
} from './utils/storage.js';

const defaultLessonId = lessons[0].id;

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(() => loadActiveLessonId(lessons, defaultLessonId));
  const [activeTab, setActiveTab] = useState('explain');
  const [progress, setProgress] = useState(() => loadProgress(lessons));

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0],
    [activeLessonId],
  );
  const completedCount = useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);

  useEffect(() => {
    saveActiveLessonId(activeLessonId);
  }, [activeLessonId]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function handleLessonSelect(lessonId) {
    setActiveLessonId(lessonId);
    setActiveTab('explain');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function markDone() {
    setProgress((current) => ({
      ...current,
      [activeLesson.id]: true,
    }));
  }

  return (
    <main className="app-shell">
      <Sidebar
        activeLesson={activeLesson}
        completedCount={completedCount}
        lessons={lessons}
        onLessonSelect={handleLessonSelect}
        progress={progress}
      />

      <section className="workspace">
        <LessonHeader lesson={activeLesson} />
        <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <LessonContent isDone={Boolean(progress[activeLesson.id])} lesson={activeLesson} onDone={markDone} tab={activeTab} />
      </section>
    </main>
  );
}
