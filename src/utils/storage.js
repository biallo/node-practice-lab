const storageKeys = {
  activeLessonId: 'node-practice-lab:active-lesson-id',
  completedLessons: 'node-practice-lab:completed-lessons',
};

export function loadActiveLessonId(lessons, fallbackId) {
  try {
    const storedId = localStorage.getItem(storageKeys.activeLessonId);
    return lessons.some((lesson) => lesson.id === storedId) ? storedId : fallbackId;
  } catch {
    return fallbackId;
  }
}

export function loadProgress(lessons) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKeys.completedLessons) ?? '{}');

    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      return {};
    }

    return Object.fromEntries(
      lessons.filter((lesson) => stored[lesson.id] === true).map((lesson) => [lesson.id, true]),
    );
  } catch {
    return {};
  }
}

export function saveActiveLessonId(activeLessonId) {
  try {
    localStorage.setItem(storageKeys.activeLessonId, activeLessonId);
  } catch {
    // localStorage can be unavailable in private browsing or restricted contexts.
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(storageKeys.completedLessons, JSON.stringify(progress));
  } catch {
    // Progress persistence is helpful, but the app should still work without it.
  }
}
