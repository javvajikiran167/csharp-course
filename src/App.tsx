import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/Home';
import { Topic } from '@/pages/Topic';
import { Lesson } from '@/pages/Lesson';
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
            <Route path="/topic/:topicSlug/:lessonSlug" element={<Lesson />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Shell>
      </AuthGate>
    </BrowserRouter>
  );
}
