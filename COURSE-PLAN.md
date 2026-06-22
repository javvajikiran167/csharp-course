# C# Course — Master Plan & Build Log

> **Authoring note (for Kiran):** This file is my plan and decision log for the
> full course build-out. I made every call here myself so I could work without
> waiting — if any decision is wrong for how you teach, change it here and I'll
> re-sequence. Nothing about the redesign is irreversible; progress is keyed by
> lesson *slug*, so re-ordering topics never wipes a student's progress.

> **Branch / coordination note:** This work lives on branch **`course-buildout`**
> (a git worktree under `.claude/worktrees/`), deliberately isolated from `main`.
> `main` currently has your in-progress **Supabase auth + Admin access-control**
> work (uncommitted: `supabase.ts`, `access.ts`, `auth.ts`, `Admin.tsx`, `.env`).
> I have not touched any of it. When you're ready, merge `course-buildout` into
> `main`; the only likely conflict points are `Home.tsx`/`Topic.tsx` (locked vs
> per-student access) and `types.ts` — all small. **Heads-up:** make sure `.env`
> is gitignored before committing on `main`.

Last updated: 2026-06-20.

---

## 1. Vision

The best free C# course a Python-background learner can take to go from "what is
a program?" to **job-ready .NET developer**. Every lesson doubles as (a) a script
a teacher can teach live from, and (b) standalone reading a student can self-study.
Every concept is tied to a **real-world scenario** and the **industry best practice**,
written in the voice of an engineer who has shipped production C# on both backend
and frontend.

## 2. Big structural decisions (locked)

### 2.1 Separate Quiz and Practice pages (was: 3 inline questions per lesson)
- **Quiz** is a dedicated per-topic page at `/topic/:slug/quiz` with **12–15
  questions** spanning the whole topic (mix of `mcq`, `predict`, `fill`).
- **Practice** is a dedicated per-topic page at `/topic/:slug/practice` with
  **≥10 problems** of escalating difficulty (easy → medium → hard) + 2 projects.
- Lesson bodies become **pure reading + examples**, which is what makes them work
  as standalone material.
- Completion model: a topic counts complete when all lessons are read **and**
  the topic quiz is passed (≥60%) **and** practice is acknowledged.

### 2.2 New topic 00 — "Programming Foundations" (pre-C#, language-agnostic)
Common to every language; gives Python-background learners the mental model. 8 lessons.

### 2.3 Dedicated Projects chapter + 2 projects per section
- Each topic ends with **2 projects** on its practice page.
- A standalone **Projects** chapter collects larger, cross-topic builds, ordered by complexity.

### 2.4 Curriculum re-sequencing (fixes the June review's open ordering issues)
LINQ depends on lambdas/delegates → **Delegates before Generics & LINQ**.
Methods more fundamental than collections → **Methods before Collections**.

### 2.5 Content gaps to fill (from June review)
enums & structs · nullable reference types / null-safety · a real **debugging** lesson · **git + deployment**.

### 2.6 The "PG thing" (top-right) — KEEP, clarify
It's the **Teacher Mode** toggle (graduation-cap icon). Real, deliberate feature
(hides instructor `teachingNotes`). On mobile the label was hidden, leaving a bare
icon that looked meaningless. **Decision: keep it, always show the "Teacher" label.**

### 2.7 Accessibility
Primary button already bumped to `amber-700` (WCAG AA 5.02:1) in a prior commit — verified, nothing to do.

## 3. Quality pipeline (how content is generated & verified)

Per topic: 1) Author lessons (rich prose + many examples + real-world scenarios +
best-practice callouts). 2) Adversarial C# verifier subagent checks every code/output
block as if compiled. 3) Author topic quiz (12–15 Q) + practice (≥10) + 2 projects.
4) `tsc --noEmit` + `vite build` pass. 5) Commit + push (one topic per commit).

## 4. Full syllabus (target)

| # | Slug | Title | Lessons | Status |
|---|------|-------|---------|--------|
| 00 | programming-foundations | Programming Foundations (pre-C#) | 8 | NEW |
| 01 | foundations | Foundations of C# | 9 | authored |
| 02 | control-flow | Control Flow | 7 | authored |
| 03 | loops | Loops & Iteration | 7 | authored |
| 04 | methods | Methods & Reusability | 7 | author |
| 05 | collections | Collections | 8 | author |
| 06 | oop | Object-Oriented Programming (+ enums/structs/records) | 12 | author |
| 07 | exceptions | Exception Handling | 5 | author |
| 08 | files | Files & Serialization | 6 | author |
| 09 | delegates | Delegates, Events & Lambdas | 5 | author |
| 10 | generics-linq | Generics & LINQ | 8 | author |
| 11 | async | Async & Await | 6 | author |
| 12 | null-safety | Null Safety & Nullable Reference Types | 4 | NEW |
| 13 | debugging | Debugging & Diagnostics | 4 | NEW |
| 14 | conventions | C# Conventions & Style | 7 | 1 authored → finish |
| 15 | databases | Databases & EF Core | 7 | author |
| 16 | web-api | Building a Web API | 8 | author |
| 17 | testing-patterns | Testing & Design Patterns | 6 | author |
| 18 | git-deploy | Source Control & Deployment | 4 | NEW |
| 19 | projects | Projects (standalone builds) | 8+ | NEW |
| 20 | capstone | Job Prep & Capstone | 6 | author |

### Topic 00 — Programming Foundations (lesson list)
1. what-is-a-program · 2. what-is-a-language · 3. how-computers-store-data ·
4. variables-and-types · 5. logic-and-control · 6. algorithms ·
7. source-to-running · 8. your-toolkit (install .NET + editor, first run)

## 5. Progress / build log

- [x] Explore codebase; confirm data model, deployment, the "PG thing".
- [x] Discover parallel Supabase work on `main`; isolate to `course-buildout` worktree.
- [x] Quiz/Practice/Projects page architecture: types, store (v4), pages, routes, Topic/Home/Lesson wiring.
- [x] Teacher-toggle clarity fix.
- [ ] Topic 00 authored end-to-end (reference implementation) + verified + pushed.
- [ ] Existing topics migrated to topic-level quiz/practice + 2 projects each.
- [ ] Remaining topics authored topic-by-topic, verified, pushed.
