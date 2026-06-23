import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { findLesson, findNextTopic } from '@/data/topics';
import { useProgress } from '@/store/progress';
import {
  Breadcrumbs,
  Button,
  Eyebrow,
  H1,
  Lead,
  Pill,
  ProgressBar,
} from '@/components/primitives';
import { BlockRenderer } from '@/components/course/BlockRenderer';
import { Quiz as QuizBlock } from '@/components/course/QuizBlock';
import { ChallengeList } from '@/components/course/ChallengeList';
import { LessonProgress } from '@/components/course/LessonProgress';
import { OnThisPage } from '@/components/course/OnThisPage';
import { LockedNotice } from '@/components/course/LockedNotice';
import { inline } from '@/lib/inline';
import { isLessonComplete } from '@/lib/completion';
import { useAuth } from '@/store/auth';
import { topicState } from '@/lib/access';

// The lesson page is the place a student spends most of their time. Width,
// rhythm, and chrome are all tuned for one job: focused reading. The column is
// held near the ~68ch prose measure so lines don't run too wide to track.
const LESSON_CONTAINER = 'mx-auto w-full max-w-prose';

export function Lesson() {
  const { topicSlug = '', lessonSlug = '' } = useParams();
  const navigate = useNavigate();
  const result = findLesson(topicSlug, lessonSlug);
  const record = useProgress((s) => s.lessons[lessonSlug]);
  const markLessonVisited = useProgress((s) => s.markLessonVisited);
  const isComplete = result ? isLessonComplete(result.lesson, record) : false;
  const isAdmin = useAuth((s) => s.isAdmin);
  const grantedTopics = useAuth((s) => s.grantedTopics);

  useEffect(() => {
    // Only on actual lesson navigation — NOT on every re-render. `result` is a
    // fresh object each render, so depending on it re-ran this effect (and
    // jumped to the top) whenever any state changed, e.g. ticking a checkbox.
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (result) {
      markLessonVisited(lessonSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug, lessonSlug]);

  if (!result) {
    return (
      <div className="container-page py-16">
        <Eyebrow>Lesson not found</Eyebrow>
        <H1 className="mt-2">We couldn't find that lesson.</H1>
        <Link to="/" className="mt-6 inline-block">
          <Button tone="secondary">← Back home</Button>
        </Link>
      </div>
    );
  }

  const { topic, lesson, index, prev, next } = result;

  // Block lesson content if this chapter isn't unlocked for the student.
  if (topicState(topic, { isAdmin, grantedTopics }) !== 'open') {
    return <LockedNotice topic={topic} />;
  }

  const lessonNumber = `0${lesson.number}`.slice(-2);
  const totalPadded = `0${topic.lessons.length}`.slice(-2);
  // On the last lesson of a topic, point forward to the next unlocked topic
  // instead of dead-ending.
  const nextTopic = next ? undefined : findNextTopic(topic.slug);

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Top wayfinding strip — minimal, no decoration */}
      <div className={LESSON_CONTAINER}>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: topic.title, to: `/topic/${topic.slug}` },
            { label: lesson.title },
          ]}
        />
        <div className="mt-5">
          <ProgressBar value={index + 1} max={topic.lessons.length} thin />
          <div className="mt-2 text-eyebrow text-ink-400">
            Lesson {lessonNumber} / {totalPadded}
          </div>
        </div>
      </div>

      {/* Lesson opener — title + objective only, no extra chrome */}
      <header className={`${LESSON_CONTAINER} mt-10`}>
        {isComplete && (
          <Pill tone="ok" dot className="mb-3">
            Completed
          </Pill>
        )}
        <H1>{lesson.title}</H1>
        <Lead className="mt-4">{inline(lesson.objective)}</Lead>
        <OnThisPage lesson={lesson} />
      </header>

      {/* The lesson itself */}
      <article className={`${LESSON_CONTAINER} mt-12`}>
        {lesson.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </article>

      <div className={LESSON_CONTAINER}>
        {/* Quizzes now live at the topic level (/topic/:slug/quiz). Only the
            legacy lessons that still carry inline questions render one here.
            key forces a fresh quiz per lesson — without it, index/score/phase
            leak across lessons. No auto-scroll on finish; learner stays put. */}
        {lesson.questions && lesson.questions.length > 0 && (
          <QuizBlock key={lesson.slug} questions={lesson.questions} />
        )}

        {lesson.challenges && lesson.challenges.length > 0 && (
          <div id="challenges">
            <ChallengeList challenges={lesson.challenges} />
          </div>
        )}

        <LessonProgress lesson={lesson} />

        <nav
          id="lesson-nav"
          className="mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-6"
          aria-label="Lesson navigation"
        >
          {prev ? (
            <Link to={`/topic/${topic.slug}/${prev.slug}`} className="block w-full sm:flex-1 sm:w-auto">
              <Button tone="ghost" className="!justify-start w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">Previous · {prev.title}</span>
              </Button>
            </Link>
          ) : (
            <Link to={`/topic/${topic.slug}`} className="block w-full sm:flex-1 sm:w-auto">
              <Button tone="ghost" className="!justify-start w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Topic overview
              </Button>
            </Link>
          )}
          {next ? (
            <Link to={`/topic/${topic.slug}/${next.slug}`} className="block w-full sm:w-auto">
              <Button tone="primary" className="w-full sm:w-auto">
                <span className="truncate">Next · {next.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : nextTopic ? (
            <Link to={`/topic/${nextTopic.slug}`} className="block w-full sm:w-auto">
              <Button tone="primary" className="w-full sm:w-auto">
                <span className="truncate">Next topic · {nextTopic.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              tone="primary"
              className="w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              <Check className="h-4 w-4" />
              Finish course
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
}
