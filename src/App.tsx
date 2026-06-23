import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/Home';
import { Topic } from '@/pages/Topic';
import { Lesson } from '@/pages/Lesson';
import { Quiz } from '@/pages/Quiz';
import { Practice } from '@/pages/Practice';
import { Admin } from '@/pages/Admin';
import { AuthGate } from '@/components/auth/AuthGate';
import { RequireAdmin } from '@/components/auth/RequireAdmin';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthGate>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              }
            />
            <Route path="/topic/:slug" element={<Topic />} />
            {/* Static segments rank above the dynamic :lessonSlug route, so these
                resolve even though the lesson route shares the prefix. */}
            <Route path="/topic/:slug/quiz" element={<Quiz />} />
            <Route path="/topic/:slug/practice" element={<Practice />} />
            <Route path="/topic/:topicSlug/:lessonSlug" element={<Lesson />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Shell>
      </AuthGate>
    </BrowserRouter>
  );
}
