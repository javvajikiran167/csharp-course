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
import { LessonProgress } from '@/components/course/LessonProgress';
import { OnThisPage } from '@/components/course/OnThisPage';
import { inline } from '@/lib/inline';
import { isLessonComplete } from '@/lib/completion';

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
  const isComplete = isLessonComplete(record);

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
  const lessonNumber = `0${lesson.number}`.slice(-2);
  const totalPadded = `0${topic.lessons.length}`.slice(-2);
  // On the last lesson of a topic, point forward to the next unlocked topic
  // instead of dead-ending.
  const nextTopic = next ? undefined : findNextTopic(topic.slug);
  const hasQuiz = (topic.quiz?.length ?? 0) > 0;

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
          ) : hasQuiz ? (
            // Last lesson → send the learner into the topic quiz.
            <Link to={`/topic/${topic.slug}/quiz`} className="block w-full sm:w-auto">
              <Button tone="primary" className="w-full sm:w-auto">
                <span className="truncate">Take the quiz</span>
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
