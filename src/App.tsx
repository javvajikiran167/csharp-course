import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/Home';
import { Topic } from '@/pages/Topic';
import { Lesson } from '@/pages/Lesson';
import { Quiz } from '@/pages/Quiz';
import { Practice } from '@/pages/Practice';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:slug" element={<Topic />} />
          {/* Static quiz/practice segments are declared before the dynamic
              lesson route. React Router v7 ranks static over dynamic, but the
              explicit order keeps intent obvious. */}
          <Route path="/topic/:slug/quiz" element={<Quiz />} />
          <Route path="/topic/:slug/practice" element={<Practice />} />
          <Route path="/topic/:topicSlug/:lessonSlug" element={<Lesson />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
