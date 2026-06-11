import { Link } from 'react-router-dom';
import { Lock, ArrowRight, BookOpenCheck, Play, RotateCcw } from 'lucide-react';
import { topics } from '@/data/topics';
import { useProgress } from '@/store/progress';
import type { Topic, Lesson } from '@/data/types';
import {
  Button,
  Card,
  Pill,
  Display,
  Lead,
  H2,
  Eyebrow,
  ProgressBar,
} from '@/components/primitives';
import { inline } from '@/lib/inline';
import { cn } from '@/lib/cn';

export function Home() {
  // Subscribe to the lesson record map so any visit/completion re-renders.
  const lessonRecords = useProgress((s) => s.lessons);
  const topicProgress = useProgress((s) => s.topicProgress);

  const unlocked = topics.filter((t) => t.status === 'unlocked');

  // Cross-topic totals
  const allUnlockedSlugs = unlocked.flatMap((t) => t.lessons.map((l) => l.slug));
  const overall = topicProgress(allUnlockedSlugs);

  // Find the "next" lesson to resume from — first un-completed unlocked lesson,
  // preferring one already visited over one untouched.
  const resume = findResumeLesson(unlocked, lessonRecords);

  const hasAnyProgress = overall.visited > 0;

  return (
    <div className="container-page py-12 sm:py-16">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="space-y-6">
          <Eyebrow>A C# course · crafted by Kiran Javvaji</Eyebrow>
          <Display>
            Learn modern C#<br />
            from first <em className="italic text-amber-700">principles</em>.
          </Display>
          <Lead>
            A focused, no-fluff course in C# fundamentals — type systems,
            compilation, OOP, async, and the patterns that make professional
            code feel inevitable. Every lesson ends with a quiz and take-home
            challenges.
          </Lead>
          <div className="flex flex-wrap gap-3 pt-2">
            {resume ? (
              <Link to={`/topic/${resume.topic.slug}/${resume.lesson.slug}`}>
                <Button tone="primary" size="lg">
                  {resume.kind === 'continue' ? 'Continue learning' : 'Start the course'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button tone="primary" size="lg" disabled>
                No content available yet
              </Button>
            )}
            <Link to="/topic/foundations">
              <Button tone="secondary" size="lg">
                View syllabus
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress / overview card */}
        <Card padded="lg" accent>
          {hasAnyProgress ? (
            <YourProgressPanel
              completed={overall.completed}
              total={overall.total}
              pct={overall.pct}
              visited={overall.visited}
              avgQuizScorePct={overall.avgQuizScorePct}
            />
          ) : (
            <CourseOverviewPanel topics={topics} unlocked={unlocked} />
          )}
        </Card>
      </section>

      {/* ── Continue card (only when there's a resume target) ─── */}
      {resume && resume.kind === 'continue' && (
        <section className="mt-12">
          <Eyebrow>Pick up where you left off</Eyebrow>
          <Card padded="lg" accent className="mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-amber-600 text-white">
                <Play className="h-5 w-5" fill="currentColor" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-eyebrow text-ink-400">
                  <span>{resume.topic.title}</span>
                  <span>·</span>
                  <span>
                    Lesson {`0${resume.lesson.number}`.slice(-2)} of{' '}
                    {`0${resume.topic.lessons.length}`.slice(-2)}
                  </span>
                </div>
                <h3 className="mt-1 font-sans font-semibold text-h3 text-ink">
                  {inline(resume.lesson.title)}
                </h3>
                <p className="mt-1 text-caption text-ink-400 leading-relaxed pr-4">
                  {inline(resume.lesson.objective)}
                </p>
              </div>
              <Link to={`/topic/${resume.topic.slug}/${resume.lesson.slug}`}>
                <Button tone="primary">
                  Resume <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* ── Syllabus ─────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between mb-6">
          <H2 className="mt-0">The syllabus</H2>
          <Pill tone="dim">{topics.length} topics</Pill>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t, i) => (
            <li key={t.slug}>
              <TopicCard
                topic={t}
                number={`0${i + 1}`.slice(-2)}
                topicProgress={topicProgress}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ── Progress panel (returning student) ─────────────────────── */

function YourProgressPanel({
  completed,
  total,
  pct,
  visited,
  avgQuizScorePct,
}: {
  completed: number;
  total: number;
  pct: number;
  visited: number;
  avgQuizScorePct: number | null;
}) {
  const inProgress = Math.max(0, visited - completed);
  const notStarted = Math.max(0, total - visited);
  return (
    <>
      <div className="flex items-center justify-between">
        <Eyebrow>Your progress</Eyebrow>
        <Pill tone="ok" dot pulse>
          Tracking
        </Pill>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-serif text-display text-ink leading-none">
          {pct}%
        </span>
        <span className="font-mono text-caption text-ink-400">
          {completed} / {total}
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar value={completed} max={total} />
      </div>
      <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
        <StatRow k="Completed" v={`${completed}`} />
        <StatRow k="In progress" v={`${inProgress}`} />
        <StatRow k="Not started" v={`${notStarted}`} />
        {avgQuizScorePct !== null && (
          <StatRow k="Avg quiz score" v={`${avgQuizScorePct}%`} accent />
        )}
      </dl>
    </>
  );
}

/* ── Overview panel (first-time visitor) ─────────────────────── */

function CourseOverviewPanel({
  topics,
  unlocked,
}: {
  topics: Topic[];
  unlocked: Topic[];
}) {
  const totalLessons = unlocked.reduce((n, t) => n + t.lessons.length, 0);
  const totalOutlineLessons = topics.reduce(
    (n, t) => n + (t.lessons.length || (t.outline?.length ?? 0)),
    0,
  );
  return (
    <>
      <Eyebrow>Course overview</Eyebrow>
      <dl className="mt-4 divide-y divide-hairline">
        <StatRow k="Topics" v={`${topics.length}`} />
        <StatRow k="Lessons available now" v={`${totalLessons}`} />
        <StatRow k="Total lessons planned" v={`${totalOutlineLessons}`} />
        <StatRow k="Quiz at every lesson" v="3 questions each" />
        <StatRow k="Level" v="Beginner → Job-ready" accent />
      </dl>
    </>
  );
}

/* ── Topic card (with per-topic progress) ────────────────────── */

function TopicCard({
  topic,
  number,
  topicProgress,
}: {
  topic: Topic;
  number: string;
  topicProgress: (slugs: string[]) => {
    visited: number;
    completed: number;
    total: number;
    pct: number;
    avgQuizScorePct: number | null;
  };
}) {
  const locked = topic.status === 'locked';
  const stats = locked
    ? null
    : topicProgress(topic.lessons.map((l) => l.slug));
  const isFinished = stats !== null && stats.completed === stats.total;
  const isInProgress = stats !== null && stats.visited > 0 && !isFinished;

  const card = (
    <Card
      padded="md"
      interactive={!locked}
      accent={!locked}
      className={cn('h-full flex flex-col', isInProgress && 'ring-1 ring-amber-300')}
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-h1 text-ink-400 leading-none">{number}</span>
        {locked ? (
          <Lock className="h-4 w-4 text-ink-400" aria-hidden />
        ) : isFinished ? (
          <Pill tone="ok" dot>
            <BookOpenCheck className="h-3 w-3" /> Done
          </Pill>
        ) : isInProgress ? (
          <Pill tone="accent" dot pulse>
            In progress
          </Pill>
        ) : (
          <Pill tone="accent">Available</Pill>
        )}
      </div>

      <h3
        className={cn(
          'mt-3 font-sans font-semibold text-h3',
          locked ? 'text-ink-400' : 'text-ink',
        )}
      >
        {topic.title}
      </h3>
      <p className="mt-1 text-caption text-ink-400 leading-relaxed">
        {topic.subtitle}
      </p>
      <div className="flex-1" />

      {locked ? (
        <div className="mt-4 flex items-center gap-2 text-caption text-ink-400">
          <span>Coming soon</span>
          {topic.outline && topic.outline.length > 0 && (
            <>
              <span>·</span>
              <span>{topic.outline.length} planned lessons</span>
            </>
          )}
        </div>
      ) : stats ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-eyebrow text-ink-400">
            <span>
              {stats.completed} / {stats.total} lessons
            </span>
            <span>{stats.pct}%</span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={stats.completed} max={stats.total} thin />
          </div>
          {stats.avgQuizScorePct !== null && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-eyebrow text-ink-400">
              <RotateCcw className="h-3 w-3" />
              avg quiz {stats.avgQuizScorePct}%
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );

  return locked ? <div>{card}</div> : <Link to={`/topic/${topic.slug}`}>{card}</Link>;
}

/* ── Helpers ────────────────────────────────────────────── */

function StatRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2.5">
      <dt className="text-eyebrow text-ink-400">{k}</dt>
      <dd
        className={cn(
          'font-mono text-caption',
          accent ? 'text-amber-700 font-semibold' : 'text-ink',
        )}
      >
        {v}
      </dd>
    </div>
  );
}

type ResumeTarget = {
  topic: Topic;
  lesson: Lesson;
  kind: 'continue' | 'start';
} | null;

// Where to send a learner who clicks the big button on the hero.
// 1. If they've visited a lesson but not finished it → that lesson.
// 2. Else, the first non-completed lesson in the first unlocked topic.
// 3. Else (everything done), the first lesson (review mode).
function findResumeLesson(
  unlockedTopics: Topic[],
  records: Record<string, { visited: boolean; completed: boolean }>,
): ResumeTarget {
  if (unlockedTopics.length === 0) return null;

  // Look for an in-progress lesson across all unlocked topics
  for (const topic of unlockedTopics) {
    for (const lesson of topic.lessons) {
      const r = records[lesson.slug];
      if (r?.visited && !r.completed) {
        return { topic, lesson, kind: 'continue' };
      }
    }
  }

  // Next: first non-completed lesson anywhere
  for (const topic of unlockedTopics) {
    for (const lesson of topic.lessons) {
      const r = records[lesson.slug];
      if (!r?.completed) {
        const hasAnyVisit = Object.values(records).some((rec) => rec?.visited);
        return { topic, lesson, kind: hasAnyVisit ? 'continue' : 'start' };
      }
    }
  }

  // Everything done — fall back to lesson 1 of the first unlocked topic
  return {
    topic: unlockedTopics[0],
    lesson: unlockedTopics[0].lessons[0],
    kind: 'continue',
  };
}
