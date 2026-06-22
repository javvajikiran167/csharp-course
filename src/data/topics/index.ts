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
import { asyncAwait } from './async';
import { databases } from './databases';
import { webApi } from './web-api';
import { testingPatterns } from './testing-patterns';
import { capstone } from './capstone';

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

  // ── 12 · Async & Await (UNLOCKED — full content authored) ──
  asyncAwait,

  // ── 13 · Databases & EF Core (UNLOCKED — full content authored) ──
  databases,

  // ── 14 · ASP.NET Core Web API (UNLOCKED — full content authored) ──
  webApi,

  // ── 15 · Testing & Design Patterns (UNLOCKED — full content authored) ──
  testingPatterns,

  // ── 16 · Job Prep & Capstone (UNLOCKED — full content authored) ──
  capstone,
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
