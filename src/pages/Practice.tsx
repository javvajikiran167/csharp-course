import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { findTopic, findNextTopic } from '@/data/topics';
import { useProgress } from '@/store/progress';
import { Breadcrumbs, Button, Eyebrow, H1, Lead, Pill } from '@/components/primitives';
import { ChallengeList } from '@/components/course/ChallengeList';
import { ProjectList } from '@/components/course/ProjectList';
import { LockedNotice } from '@/components/course/LockedNotice';
import { useAuth } from '@/store/auth';
import { topicState } from '@/lib/access';
import { cn } from '@/lib/cn';

// The per-topic Practice page: ≥10 take-home problems (easy → hard) plus the
// topic's two projects. The learner ticks "practice done" when they've worked
// through enough of it — that flag feeds topic completion.
export function Practice() {
  const { slug = '' } = useParams();
  const topic = findTopic(slug);
  const done = useProgress((s) => s.topicPractice[slug] ?? false);
  const setTopicPracticeDone = useProgress((s) => s.setTopicPracticeDone);
  const isAdmin = useAuth((s) => s.isAdmin);
  const grantedTopics = useAuth((s) => s.grantedTopics);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (!topic || topic.status === 'locked') {
    return (
      <div className="container-page py-16">
        <Eyebrow>Practice unavailable</Eyebrow>
        <H1 className="mt-2">This topic isn't open yet.</H1>
        <Link to="/" className="mt-6 inline-block">
          <Button tone="secondary">← Back home</Button>
        </Link>
      </div>
    );
  }

  // Per-student gating: a student can't reach practice for a chapter they don't have.
  if (topicState(topic, { isAdmin, grantedTopics }) !== 'open') {
    return <LockedNotice topic={topic} />;
  }

  const challenges = topic.practice ?? [];
  const projects = topic.projects ?? [];
  const nextTopic = findNextTopic(topic.slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto w-full max-w-prose">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: topic.title, to: `/topic/${topic.slug}` },
            { label: 'Practice' },
          ]}
        />

        <header className="mt-8">
          <div className="flex items-center gap-3">
            <Eyebrow>Practice</Eyebrow>
            {done && <Pill tone="ok" dot>Marked done</Pill>}
          </div>
          <H1 className="mt-2">{topic.title} — Practice</H1>
          <Lead className="mt-4">
            {challenges.length} problems that build from a warm-up to interview-grade,
            then two projects to pull it all together. Write and run every one in your
            editor — reading the answer is not the same as earning it.
          </Lead>
        </header>

        {challenges.length > 0 && <ChallengeList challenges={challenges} />}
        {projects.length > 0 && <ProjectList projects={projects} />}

        {/* Acknowledgement toggle — feeds topic completion */}
        <section className="mt-12 border border-hairline bg-cream-50 p-6">
          <Eyebrow>Track your progress</Eyebrow>
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            onClick={() => setTopicPracticeDone(topic.slug, !done)}
            className={cn(
              'mt-3 group flex w-full flex-wrap items-center gap-3 border bg-white px-4 py-3 text-left transition-colors',
              done ? 'border-ok bg-ok-soft/40' : 'border-hairline hover:border-amber-400',
            )}
          >
            <span
              className={cn(
                'inline-flex h-5 w-5 shrink-0 items-center justify-center border',
                done ? 'border-ok bg-ok text-white' : 'border-hairline bg-white text-transparent',
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 font-sans font-medium text-ink">
              I've worked through the practice for this topic
            </span>
          </button>
        </section>

        <nav
          className="mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-6"
          aria-label="Practice navigation"
        >
          <Link to={`/topic/${topic.slug}/quiz`} className="block w-full sm:flex-1 sm:w-auto">
            <Button tone="ghost" className="!justify-start w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Back to quiz
            </Button>
          </Link>
          {nextTopic ? (
            <Link to={`/topic/${nextTopic.slug}`} className="block w-full sm:w-auto">
              <Button tone="primary" className="w-full sm:w-auto">
                <span className="truncate">Next topic · {nextTopic.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to={`/topic/${topic.slug}`} className="block w-full sm:w-auto">
              <Button tone="primary" className="w-full sm:w-auto">
                Topic overview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
