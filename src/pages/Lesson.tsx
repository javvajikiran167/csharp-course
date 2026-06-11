import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { findLesson } from '@/data/topics';
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
import { QuizBlock } from '@/components/course/QuizBlock';
import { ChallengeList } from '@/components/course/ChallengeList';
import { inline } from '@/lib/inline';

// The lesson page is the place a student spends most of their time. Width,
// rhythm, and chrome are all tuned for one job: focused reading.
const LESSON_CONTAINER = 'mx-auto w-full max-w-3xl';

export function Lesson() {
  const { topicSlug = '', lessonSlug = '' } = useParams();
  const navigate = useNavigate();
  const result = findLesson(topicSlug, lessonSlug);
  const isComplete = useProgress((s) => s.isLessonComplete(lessonSlug));
  const markLessonVisited = useProgress((s) => s.markLessonVisited);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (result) {
      markLessonVisited(lessonSlug);
    }
  }, [topicSlug, lessonSlug, result, markLessonVisited]);

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
      </header>

      {/* The lesson itself */}
      <article className={`${LESSON_CONTAINER} mt-12`}>
        {lesson.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </article>

      <div className={LESSON_CONTAINER}>
        <QuizBlock
          lessonSlug={lesson.slug}
          questions={lesson.questions}
          onComplete={() => {
            setTimeout(() => {
              document
                .getElementById(lesson.challenges?.length ? 'challenges' : 'lesson-nav')
                ?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
        />

        {lesson.challenges && lesson.challenges.length > 0 && (
          <div id="challenges">
            <ChallengeList challenges={lesson.challenges} />
          </div>
        )}

        <nav
          id="lesson-nav"
          className="mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-6"
          aria-label="Lesson navigation"
        >
          {prev ? (
            <Link to={`/topic/${topic.slug}/${prev.slug}`} className="sm:flex-1">
              <Button tone="ghost" className="!justify-start w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">Previous · {prev.title}</span>
              </Button>
            </Link>
          ) : (
            <Link to={`/topic/${topic.slug}`} className="sm:flex-1">
              <Button tone="ghost" className="!justify-start w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Topic overview
              </Button>
            </Link>
          )}
          {next ? (
            <Link to={`/topic/${topic.slug}/${next.slug}`}>
              <Button tone="primary" className="w-full sm:w-auto">
                <span className="truncate">Next · {next.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              tone="primary"
              className="w-full sm:w-auto"
              onClick={() => navigate(`/topic/${topic.slug}`)}
            >
              <Check className="h-4 w-4" />
              Finish topic
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
}
