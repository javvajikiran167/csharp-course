import { Link } from 'react-router-dom';
import { Lock, ArrowRight, BookOpenCheck, Play } from 'lucide-react';
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
import { isLessonComplete } from '@/lib/completion';
import { cn } from '@/lib/cn';
import { useAuth } from '@/store/auth';
import { topicState, type TopicState } from '@/lib/access';

export function Home() {
  // Subscribe to the lesson record map so any visit/completion re-renders.
  const lessonRecords = useProgress((s) => s.lessons);
  const topicProgress = useProgress((s) => s.topicProgress);

  const isAdmin = useAuth((s) => s.isAdmin);
  const grantedTopics = useAuth((s) => s.grantedTopics);
  const ctx = { isAdmin, grantedTopics };

  // Topics this student can actually open right now (admins: all authored).
  const unlocked = topics.filter((t) => topicState(t, ctx) === 'open');

  // Cross-topic totals
  const allUnlockedLessons = unlocked.flatMap((t) => t.lessons);
  const overall = topicProgress(allUnlockedLessons);

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
            code feel inevitable. Every topic ends with a quiz, a practice set,
            and projects you can build.
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
                {isAdmin ? 'No content available yet' : 'Waiting for your instructor'}
              </Button>
            )}
            <a href="#syllabus">
              <Button tone="secondary" size="lg">
                View syllabus
              </Button>
            </a>
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
      <section id="syllabus" className="mt-16 scroll-mt-16">
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
                state={topicState(t, ctx)}
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
}: {
  completed: number;
  total: number;
  pct: number;
  visited: number;
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
        <StatRow k="Lessons read" v={`${completed}`} />
        <StatRow k="In progress" v={`${inProgress}`} />
        <StatRow k="Not started" v={`${notStarted}`} />
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
        <StatRow k="Per topic" v="Quiz + practice + projects" />
        <StatRow k="Level" v="Beginner → Job-ready" accent />
      </dl>
    </>
  );
}

/* ── Topic card (with per-topic progress) ────────────────────── */

function TopicCard({
  topic,
  number,
  state,
  topicProgress,
}: {
  topic: Topic;
  number: string;
  state: TopicState;
  topicProgress: (lessons: Lesson[]) => {
    visited: number;
    completed: number;
    total: number;
    pct: number;
  };
}) {
  const open = state === 'open';
  const perStudentLocked = state === 'locked';
  const stats = open ? topicProgress(topic.lessons) : null;
  const isFinished = stats !== null && stats.completed === stats.total;
  const isInProgress = stats !== null && stats.visited > 0 && !isFinished;

  const card = (
    <Card
      padded="md"
      interactive={open || perStudentLocked}
      accent={open}
      className={cn('h-full flex flex-col', isInProgress && 'ring-1 ring-amber-300')}
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-h1 text-ink-400 leading-none">{number}</span>
        {open ? (
          isFinished ? (
            <Pill tone="ok" dot>
              <BookOpenCheck className="h-3 w-3" /> Done
            </Pill>
          ) : isInProgress ? (
            <Pill tone="accent" dot pulse>
              In progress
            </Pill>
          ) : (
            <Pill tone="accent">Available</Pill>
          )
        ) : perStudentLocked ? (
          <Pill tone="dim">
            <Lock className="h-3 w-3" /> Locked
          </Pill>
        ) : (
          <Lock className="h-4 w-4 text-ink-400" aria-hidden />
        )}
      </div>

      <h3
        className={cn(
          'mt-3 font-sans font-semibold text-h3',
          open ? 'text-ink' : 'text-ink-400',
        )}
      >
        {topic.title}
      </h3>
      <p className="mt-1 text-caption text-ink-400 leading-relaxed">
        {topic.subtitle}
      </p>
      <div className="flex-1" />

      {open && stats ? (
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
        </div>
      ) : perStudentLocked ? (
        <div className="mt-4 inline-flex items-center gap-1.5 text-caption font-medium text-amber-700">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          <span>Tap to request access</span>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-caption text-ink-400">
          <span>Coming soon</span>
          {topic.outline && topic.outline.length > 0 && (
            <>
              <span>·</span>
              <span>{topic.outline.length} planned lessons</span>
            </>
          )}
        </div>
      )}
    </Card>
  );

  // Open and per-student-locked cards are clickable; a locked card routes to the
  // request screen. Coming-soon (un-authored) cards aren't clickable.
  return open || perStudentLocked ? (
    <Link to={`/topic/${topic.slug}`}>{card}</Link>
  ) : (
    <div>{card}</div>
  );
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
  records: Record<string, { visited: boolean; read?: boolean; quizDone?: boolean; practiceDone?: boolean }>,
): ResumeTarget {
  if (unlockedTopics.length === 0) return null;

  // Look for an in-progress lesson across all unlocked topics
  for (const topic of unlockedTopics) {
    for (const lesson of topic.lessons) {
      const r = records[lesson.slug];
      if (r?.visited && !isLessonComplete(r)) {
        return { topic, lesson, kind: 'continue' };
      }
    }
  }

  // Next: first non-completed lesson anywhere
  for (const topic of unlockedTopics) {
    for (const lesson of topic.lessons) {
      const r = records[lesson.slug];
      if (!isLessonComplete(r)) {
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
