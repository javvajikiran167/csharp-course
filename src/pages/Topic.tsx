import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { findTopic } from '@/data/topics';
import { useProgress } from '@/store/progress';
import {
  Breadcrumbs,
  Button,
  Card,
  Eyebrow,
  Display,
  Lead,
  ProgressBar,
} from '@/components/primitives';
import { LessonTimeline } from '@/components/course/LessonTimeline';
import { ProjectList } from '@/components/course/ProjectList';
import { LockedNotice } from '@/components/course/LockedNotice';
import { inline } from '@/lib/inline';
import { isLessonComplete } from '@/lib/completion';
import { useAuth } from '@/store/auth';
import { topicState } from '@/lib/access';

export function Topic() {
  const { slug = '' } = useParams();
  const topic = findTopic(slug);

  // Subscribe to the whole lessons map so any update (visit, completion) re-renders.
  const lessonRecords = useProgress((s) => s.lessons);
  const topicProgress = useProgress((s) => s.topicProgress);

  // Per-student access (admins see everything).
  const isAdmin = useAuth((s) => s.isAdmin);
  const grantedTopics = useAuth((s) => s.grantedTopics);

  if (!topic) {
    return (
      <div className="container-page py-16">
        <Eyebrow>Topic not found</Eyebrow>
        <Display className="mt-2">No such topic.</Display>
        <Link to="/" className="mt-6 inline-block">
          <Button tone="secondary">← Back home</Button>
        </Link>
      </div>
    );
  }

  // Authored chapter the instructor hasn't unlocked for this student yet.
  if (topicState(topic, { isAdmin, grantedTopics }) === 'locked') {
    return <LockedNotice topic={topic} />;
  }

  if (topic.status === 'locked') {
    const outline = topic.outline ?? [];
    return (
      <div className="container-page py-12 sm:py-16">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: topic.title }]} />
        <div className="mt-8">
          <Eyebrow>Coming soon · Locked</Eyebrow>
          <Display className="mt-2">{topic.title}</Display>
          <Lead className="mt-4">{inline(topic.subtitle)}</Lead>
        </div>

        {outline.length > 0 && (
          <section className="mt-12">
            <Eyebrow>What you'll learn</Eyebrow>
            <ol className="mt-4 divide-y divide-hairline border-y border-hairline">
              {outline.map((stub) => (
                <li key={stub.slug} className="py-4 flex items-start gap-5">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline bg-cream-200 font-mono text-caption text-ink-400">
                    {`0${stub.number}`.slice(-2)}
                  </span>
                  <div className="flex-1">
                    <div className="font-sans font-semibold text-ink">{inline(stub.title)}</div>
                    <p className="mt-1 text-caption text-ink-400 leading-relaxed">
                      {inline(stub.objective)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-10">
          <Link to="/">
            <Button tone="secondary">← Back to syllabus</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Reading lessonRecords above forces a re-subscribe — the call below is fresh.
  void lessonRecords;
  const stats = topicProgress(topic.lessons);

  const firstUndoneIdx = topic.lessons.findIndex(
    (l) => !isLessonComplete(lessonRecords[l.slug]),
  );
  const firstUndone =
    firstUndoneIdx >= 0 ? topic.lessons[firstUndoneIdx] : topic.lessons[0];

  const ctaLabel =
    stats.completed === 0
      ? 'Begin'
      : stats.completed === stats.total
      ? 'Review'
      : 'Continue';

  return (
    <div className="container-page py-12 sm:py-16">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: topic.title }]} />

      <header className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Topic</Eyebrow>
          <Display className="mt-2">{topic.title}</Display>
          <Lead className="mt-4">{inline(topic.subtitle)}</Lead>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/topic/${topic.slug}/${firstUndone.slug}`}>
              <Button tone="primary" size="lg">
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button tone="secondary" size="lg">All topics</Button>
            </Link>
          </div>
        </div>

        {/* ── Progress panel ────────────────────────────── */}
        <Card padded="lg" accent>
          <Eyebrow>Your progress</Eyebrow>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-h1 text-ink leading-none">
                {stats.completed}
              </span>
              <span className="font-mono text-caption text-ink-400">
                of {stats.total} lessons
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={stats.completed} max={stats.total} />
            </div>
            <div className="mt-1 text-eyebrow text-ink-400">{stats.pct}%</div>
          </div>

          <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
            <StatRow k="Started" v={`${stats.visited - stats.completed}`} />
            <StatRow k="Completed" v={`${stats.completed}`} />
            <StatRow k="Not started" v={`${stats.total - stats.visited}`} />
            {stats.avgQuizScorePct !== null && (
              <StatRow k="Avg quiz score" v={`${stats.avgQuizScorePct}%`} accent />
            )}
          </dl>
        </Card>
      </header>

      {/* ── Lesson list ─────────────────────────────── */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Lessons</Eyebrow>
          <span className="text-eyebrow text-ink-400">
            {stats.completed} / {stats.total} done
          </span>
        </div>
        <div className="mt-4 border border-hairline bg-white">
          <LessonTimeline topic={topic} />
        </div>
      </section>

      {/* Assessment is per-lesson now: each lesson carries its own inline quiz +
          practice (shown at the end of the lesson). Only the larger topic
          projects remain at the topic level, rendered below. */}

      {/* ── Topic projects (larger end-of-topic builds) ──────── */}
      {topic.projects && topic.projects.length > 0 && (
        <ProjectList projects={topic.projects} />
      )}
    </div>
  );
}

function StatRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2.5">
      <dt className="text-eyebrow text-ink-400">{k}</dt>
      <dd
        className={
          accent
            ? 'font-mono text-caption text-amber-700 font-semibold'
            : 'font-mono text-caption text-ink'
        }
      >
        {v}
      </dd>
    </div>
  );
}
