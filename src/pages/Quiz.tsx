import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { findTopic } from '@/data/topics';
import { useProgress } from '@/store/progress';
import { Breadcrumbs, Button, Eyebrow, H1, Lead, Pill } from '@/components/primitives';
import { Quiz as QuizRunner } from '@/components/course/QuizBlock';
import { QUIZ_PASS_PCT } from '@/lib/completion';

// The per-topic graded quiz. Pulls topic.quiz (12–15 questions) and records the
// best score so the topic can be marked complete at ≥60%.
export function Quiz() {
  const { slug = '' } = useParams();
  const topic = findTopic(slug);
  const recordTopicQuiz = useProgress((s) => s.recordTopicQuiz);
  const quizRec = useProgress((s) => s.topicQuiz[slug]);
  const passed = useProgress((s) => s.topicQuizPassed(slug));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (!topic || topic.status === 'locked') {
    return (
      <div className="container-page py-16">
        <Eyebrow>Quiz unavailable</Eyebrow>
        <H1 className="mt-2">This topic isn't open yet.</H1>
        <Link to="/" className="mt-6 inline-block">
          <Button tone="secondary">← Back home</Button>
        </Link>
      </div>
    );
  }

  const questions = topic.quiz ?? [];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto w-full max-w-prose">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: topic.title, to: `/topic/${topic.slug}` },
            { label: 'Quiz' },
          ]}
        />

        <header className="mt-8">
          <div className="flex items-center gap-3">
            <Eyebrow>Topic quiz</Eyebrow>
            {passed && (
              <Pill tone="ok" dot>
                Passed{quizRec ? ` · best ${quizRec.best}/${quizRec.total}` : ''}
              </Pill>
            )}
          </div>
          <H1 className="mt-2">{topic.title} — Quiz</H1>
          <Lead className="mt-4">
            {questions.length} questions covering the whole topic. Score{' '}
            {QUIZ_PASS_PCT}% or higher to pass. You can retry as many times as you like —
            we keep your best score.
          </Lead>
        </header>

        <div className="mt-10">
          <QuizRunner
            key={topic.slug}
            questions={questions}
            onFinish={(score, total) => recordTopicQuiz(topic.slug, score, total)}
          />
        </div>

        {passed && (
          <div className="mt-8 flex items-center gap-2 border border-ok bg-ok-soft/60 px-4 py-3 text-body text-ink">
            <CheckCircle2 className="h-4 w-4 text-ok" />
            You've passed this quiz. It counts toward completing the topic.
          </div>
        )}

        <nav
          className="mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-6"
          aria-label="Quiz navigation"
        >
          <Link to={`/topic/${topic.slug}`} className="block w-full sm:flex-1 sm:w-auto">
            <Button tone="ghost" className="!justify-start w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Topic overview
            </Button>
          </Link>
          <Link to={`/topic/${topic.slug}/practice`} className="block w-full sm:w-auto">
            <Button tone="primary" className="w-full sm:w-auto">
              Practice problems
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
