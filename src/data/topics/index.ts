import type { Topic, LessonStub } from '@/data/types';
import { programmingFoundations } from './programming-foundations';
import { foundations } from './foundations';
import { controlFlow } from './control-flow';
import { loops } from './loops';
import { methods } from './methods';
import { collections } from './collections';
import { oop } from './oop';
import { exceptions } from './exceptions';
import { files } from './files';
import { delegates } from './delegates';
import { conventions } from './conventions';
import { genericsLinq } from './generics-linq';

// ────────────────────────────────────────────────────────────────
//  Complete C# course outline — 16 topics from basics → job-ready
//
//  Locked topics list their lesson outlines so students see the
//  exact path forward. To unlock a topic, author its lessons and
//  flip status to 'unlocked'.
// ────────────────────────────────────────────────────────────────

const stub = (
  slug: string,
  title: string,
  subtitle: string,
  outline: LessonStub[],
): Topic => ({
  slug,
  title,
  subtitle,
  status: 'locked',
  lessons: [],
  outline,
});

const lesson = (number: number, slug: string, title: string, objective: string): LessonStub => ({
  number,
  slug,
  title,
  objective,
});

export const topics: Topic[] = [
  // ── 00 · Programming Foundations (UNLOCKED — pre-C#, language-agnostic) ──
  programmingFoundations,

  // ── 01 · Foundations (UNLOCKED — full content authored) ──
  foundations,

  // ── 02 · Control Flow (UNLOCKED — full content authored) ──
  controlFlow,

  // ── 03 · Loops & Iteration (UNLOCKED — full content authored) ──
  loops,

  // ── 04 · Methods & Reusability (UNLOCKED — full content authored) ──
  methods,

  // ── 05 · Collections (UNLOCKED — full content authored) ──
  collections,

  // ── 06 · Object-Oriented Programming (UNLOCKED — full content authored) ──
  oop,

  // ── 07 · Exception Handling (UNLOCKED — full content authored) ──
  exceptions,

  // ── 08 · Files & Serialization (UNLOCKED — full content authored) ──
  files,

  // ── 09 · C# Conventions & Style (lesson 1 authored; rest in outline) ──
  conventions,

  // ── 10 · Delegates, Events & Lambdas (UNLOCKED — full content authored) ──
  delegates,

  // ── 11 · Generics & LINQ (UNLOCKED — full content authored) ──
  genericsLinq,

  // ── 12 · Async / Await ──
  stub(
    'async',
    'Async & Await',
    'Write non-blocking code that scales — the foundation of every modern .NET web service.',
    [
      lesson(1, 'why-async', 'Why Async — Blocking vs Non-Blocking', 'Threads, scalability, and where async wins.'),
      lesson(2, 'task', 'Task & Task<T>', 'The async return types — and how to await them.'),
      lesson(3, 'async-await', 'async / await Syntax', 'The keywords that make async code read like sync code.'),
      lesson(4, 'pitfalls', 'Common Async Pitfalls', 'Deadlocks, async void, ConfigureAwait — interview favorites.'),
      lesson(5, 'cancellation', 'CancellationToken', 'Stop work cleanly when the user navigates away or the request times out.'),
      lesson(6, 'mini-project-async', 'Mini-Project — Parallel URL Fetcher', 'Fetch many URLs concurrently with Task.WhenAll.'),
    ],
  ),

  // ── 13 · Databases & EF Core ──
  stub(
    'databases',
    'Databases & EF Core',
    'Talk to a real database with Entity Framework Core — the ORM behind most production .NET apps.',
    [
      lesson(1, 'ef-intro', 'What is an ORM? EF Core Overview', 'Why we don\'t write raw SQL by hand anymore (mostly).'),
      lesson(2, 'dbcontext', 'DbContext & DbSet', 'The two classes you build every EF app around.'),
      lesson(3, 'migrations', 'Migrations & Schema Evolution', 'Add a column without losing data.'),
      lesson(4, 'querying', 'Querying with LINQ to EF', 'Where, Include, OrderBy — how queries translate to SQL.'),
      lesson(5, 'crud', 'Insert, Update, Delete', 'The state-tracking model EF uses for changes.'),
      lesson(6, 'relationships', 'One-to-Many & Many-to-Many', 'Model real-world relationships in code.'),
      lesson(7, 'mini-project-db', 'Mini-Project — Blog with SQLite', 'Build a console blog app backed by a real SQLite database — you\'ll wrap it in a Web API in the next topic.'),
    ],
  ),

  // ── 14 · ASP.NET Core Web API ──
  stub(
    'web-api',
    'Building a Web API',
    'Build production-grade REST APIs with ASP.NET Core — the most marketable skill for a junior .NET developer.',
    [
      lesson(1, 'minimal-api', 'Minimal API — Hello World', 'Spin up a web server in 5 lines of code.'),
      lesson(2, 'routing', 'Routing & HTTP Verbs', 'GET, POST, PUT, DELETE — and route patterns.'),
      lesson(3, 'controllers', 'Controllers vs Minimal API', 'When to use which.'),
      lesson(4, 'model-binding', 'Model Binding & Validation', 'How JSON becomes C# objects, and how to reject bad input.'),
      lesson(5, 'di', 'Dependency Injection', 'The built-in DI container — register, inject, scope.'),
      lesson(6, 'middleware', 'Middleware Pipeline', 'Authentication, CORS, logging — the pipeline behind every request.'),
      lesson(7, 'auth', 'Authentication & Authorization', 'JWT tokens, [Authorize], policy-based authz.'),
      lesson(8, 'mini-project-api', 'Mini-Project — Tasks REST API', 'CRUD a tasks list with EF Core + JWT auth.'),
    ],
  ),

  // ── 15 · Testing & Design Patterns ──
  stub(
    'testing-patterns',
    'Testing & Design Patterns',
    'Write unit tests with xUnit, mock dependencies with Moq, and learn the patterns interviewers ask about.',
    [
      lesson(1, 'xunit', 'xUnit Basics', 'Fact, Theory, InlineData — the test framework most teams use.'),
      lesson(2, 'arrange-act-assert', 'Arrange-Act-Assert', 'The structure every good test follows.'),
      lesson(3, 'mocks', 'Mocking with Moq', 'Test in isolation by faking dependencies.'),
      lesson(4, 'tdd', 'Test-Driven Development', 'Red, green, refactor — the discipline.'),
      lesson(5, 'solid', 'SOLID Principles', 'The five letters that come up in every senior interview.'),
      lesson(6, 'patterns', 'Singleton, Factory, Strategy, Observer', 'The four classic patterns you must know by name.'),
    ],
  ),

  // ── 16 · Job Prep & Capstone ──
  stub(
    'capstone',
    'Job Prep & Capstone',
    'Mock interviews, common algorithm problems in C#, code-review checklists, and a full-stack capstone you can put on your resume.',
    [
      lesson(1, 'algorithms', 'Common Algorithm Problems in C#', 'Two-pointer, sliding window, hash map — practiced in C# syntax.'),
      lesson(2, 'mock-interview', 'A Walk Through a Mock Interview', 'What hiring managers actually ask, and how to think aloud.'),
      lesson(3, 'code-review', 'How to Read & Review Other People\'s Code', 'A practical skill every job posting expects.'),
      lesson(4, 'capstone-spec', 'Capstone Spec — Tasks App End-to-End', 'EF Core backend, ASP.NET API, tests, deployment.'),
      lesson(5, 'capstone-build', 'Capstone — Build & Iterate', 'Implement, test, refactor.'),
      lesson(6, 'next-steps', 'Where to Go From Here', 'Specializations: Unity, mobile (MAUI), cloud (Azure), advanced .NET.'),
    ],
  ),
];

export const findTopic = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);

// The next unlocked topic after `slug` — so finishing a topic's last lesson
// can point forward instead of dead-ending on the topic overview.
export const findNextTopic = (slug: string): Topic | undefined => {
  const idx = topics.findIndex((t) => t.slug === slug);
  if (idx === -1) return undefined;
  return topics.slice(idx + 1).find((t) => t.status === 'unlocked');
};

export const findLesson = (topicSlug: string, lessonSlug: string) => {
  const topic = findTopic(topicSlug);
  if (!topic) return undefined;
  const idx = topic.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) return undefined;
  return {
    topic,
    lesson: topic.lessons[idx],
    index: idx,
    prev: idx > 0 ? topic.lessons[idx - 1] : undefined,
    next: idx < topic.lessons.length - 1 ? topic.lessons[idx + 1] : undefined,
  };
};
