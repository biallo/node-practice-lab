export function LessonTabs({ activeTab, onTabChange }) {
  return (
    <div className="lesson-tabs" role="tablist" aria-label="课程详情分类">
      <button
        className={activeTab === 'explain' ? 'lesson-tab active' : 'lesson-tab'}
        type="button"
        role="tab"
        aria-selected={activeTab === 'explain'}
        onClick={() => onTabChange('explain')}
      >
        讲解
      </button>
      <button
        className={activeTab === 'review' ? 'lesson-tab active' : 'lesson-tab'}
        type="button"
        role="tab"
        aria-selected={activeTab === 'review'}
        onClick={() => onTabChange('review')}
      >
        复盘
      </button>
    </div>
  );
}
