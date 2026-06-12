import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// UI preferences that aren't learning progress. Kept in its own store so the
// progress store stays focused on lesson/quiz state.
//
// teacherMode gates instructor-facing content (the teachingNotes blocks).
// It defaults to OFF so the public/student view is clean; an instructor flips
// it on while teaching live. The choice is persisted per browser.
type PrefsState = {
  teacherMode: boolean;
  toggleTeacherMode: () => void;
  setTeacherMode: (on: boolean) => void;
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      teacherMode: false,
      toggleTeacherMode: () => set((s) => ({ teacherMode: !s.teacherMode })),
      setTeacherMode: (on) => set({ teacherMode: on }),
    }),
    {
      name: 'csharp-course-prefs',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
