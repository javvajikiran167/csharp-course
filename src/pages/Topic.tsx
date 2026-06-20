import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ListChecks, Dumbbell, CheckCircle2 } from 'lucide-react';
import { findTopic } from '@/data/topics';
import { useProgress } from '@/store/progress';
import {
  Breadcrumbs,
  Button,
  Card,
  Eyebrow,
  Display,
  Lead,
  Pill,
  ProgressBar,
} from '@/components/primitives';
import { LessonTimeline } from '@/components/course/LessonTimeline';
import { inline } from '@/lib/inline';
import { isLessonComplete, isTopicComplete } from '@/lib/completion';

export function Topic() {
  const { slug = '' } = useParams();
  const topic = findTopic(slug);

  // Subscribe to the whole lessons map so any update (visit, completion) re-renders.
  const lessonRecords = useProgress((s) => s.lessons);
  const topicProgress = useProgress((s) => s.topicProgress);
  const quizPassed = useProgress((s) => s.topicQuizPassed(slug));
  const practiceDone = useProgress((s) => s.topicPractice[slug] ?? false);

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

  const hasQuiz = (topic.quiz?.length ?? 0) > 0;
  const hasPractice = (topic.practice?.length ?? 0) > 0 || (topic.projects?.length ?? 0) > 0;
  const topicComplete = isTopicComplete({
    topic,
    lessonsRead: stats.completed,
    quizPassed,
    practiceDone,
  });

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
            <StatRow k="Lessons read" v={`${stats.completed} / ${stats.total}`} />
            {hasQuiz && <StatRow k="Quiz" v={quizPassed ? 'Passed' : 'Not passed'} accent={quizPassed} />}
            {hasPractice && (
              <StatRow k="Practice" v={practiceDone ? 'Done' : 'Not done'} accent={practiceDone} />
            )}
            {topicComplete && <StatRow k="Topic" v="Complete ✓" accent />}
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

      {/* ── Assess: Quiz + Practice ──────────────────── */}
      {(hasQuiz || hasPractice) && (
        <section className="mt-14">
          <Eyebrow>Test yourself</Eyebrow>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {hasQuiz && (
              <AssessCard
                to={`/topic/${topic.slug}/quiz`}
                icon={<ListChecks className="h-5 w-5" />}
                title="Topic quiz"
                desc={`${topic.quiz!.length} questions across the whole topic. ${quizPassed ? '' : 'Score 60% to pass.'}`}
                done={quizPassed}
                doneLabel="Passed"
              />
            )}
            {hasPractice && (
              <AssessCard
                to={`/topic/${topic.slug}/practice`}
                icon={<Dumbbell className="h-5 w-5" />}
                title="Practice & projects"
                desc={`${topic.practice?.length ?? 0} problems + ${topic.projects?.length ?? 0} projects to build in your editor.`}
                done={practiceDone}
                doneLabel="Done"
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function AssessCard({
  to,
  icon,
  title,
  desc,
  done,
  doneLabel,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  desc: string;
  done: boolean;
  doneLabel: string;
}) {
  return (
    <Link to={to}>
      <Card padded="md" interactive accent className="h-full flex flex-col">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center bg-amber-600 text-white">
            {icon}
          </span>
          {done ? (
            <Pill tone="ok" dot>
              <CheckCircle2 className="h-3 w-3" /> {doneLabel}
            </Pill>
          ) : (
            <Pill tone="accent">Available</Pill>
          )}
        </div>
        <h3 className="mt-3 font-sans font-semibold text-h3 text-ink">{title}</h3>
        <p className="mt-1 text-caption text-ink-400 leading-relaxed flex-1">{desc}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-eyebrow font-semibold text-amber-700">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Card>
    </Link>
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
