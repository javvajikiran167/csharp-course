import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';

// The first lesson is fully authored — it introduces the topic and shows
// every convention in one example. Lessons 2–7 are listed in the topic
// outline so students see the full path; their full content lands in the
// next authoring sessions.
//
// To unlock more lessons: drop `lesson-NN.ts` into this folder, import here,
// add to `lessons:` array.

export const conventions: Topic = {
  slug: 'conventions',
  title: 'C# Conventions & Style',
  subtitle:
    "Microsoft's official C# style and naming conventions — the rules every professional codebase follows. Positioned after Methods so every term in the conventions has meaning.",
  status: 'unlocked',
  lessons: [lesson01],
  outline: [
    {
      number: 2,
      slug: 'variables-locals',
      title: 'Variables, Parameters, and Local Style',
      objective:
        '`camelCase` for locals and parameters, when to use `var`, naming booleans (`isX`, `hasX`, `canX`).',
    },
    {
      number: 3,
      slug: 'methods-properties',
      title: 'Methods and Properties',
      objective:
        '`PascalCase`, verb-first method names, expression-bodied properties, `Async` suffix for async methods.',
    },
    {
      number: 4,
      slug: 'types',
      title: 'Classes, Records, Interfaces, and Enums',
      objective:
        '`PascalCase` for type names, `I` prefix for interfaces, `T` prefix for generics, plural enum names with [Flags].',
    },
    {
      number: 5,
      slug: 'constants-fields',
      title: 'Constants, Static Fields, and Readonly',
      objective:
        '`PascalCase` for `const` and `static`, `_camelCase` for private instance fields, when to use `readonly` vs `const`.',
    },
    {
      number: 6,
      slug: 'files-namespaces',
      title: 'Files, Namespaces, and Project Layout',
      objective:
        'One public type per file, file name matches the type, namespace matches the folder structure.',
    },
    {
      number: 7,
      slug: 'code-layout',
      title: 'Code Layout & EditorConfig',
      objective:
        'Brace style, 4-space indent, blank lines, `using` ordering — and how `.editorconfig` automates the rules across your team.',
    },
  ],
};
