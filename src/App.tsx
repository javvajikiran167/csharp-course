import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/Home';
import { Topic } from '@/pages/Topic';
import { Lesson } from '@/pages/Lesson';

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:slug" element={<Topic />} />
          <Route path="/topic/:topicSlug/:lessonSlug" element={<Lesson />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
