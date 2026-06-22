# Build-out Status

**Live updated by Claude as each topic lands.** For real-time agent-level progress, run `/workflows` in the Claude session.

_Last updated: 2026-06-22 ~22:30 (Asia/Calcutta)_

## How to watch progress
- **`/workflows`** — live tree of running agents (Research → Author → Verify → Assessment).
- **This file (`STATUS.md`)** — refreshed at every topic; visible on the `course-buildout` branch on GitHub.
- **`git log --oneline`** on branch `course-buildout` — one commit per shipped topic.

## Shipped & verified ✅ (branch `course-buildout`, pushed)
| # | Topic | Lessons | Quiz | Practice | Projects |
|---|-------|--------:|-----:|---------:|---------:|
| — | Architecture: per-topic Quiz/Practice/Projects pages, progress v4, Teacher-label fix, .NET 10/C# 14 | — | — | — | — |
| 00 | Programming Foundations (pre-C#) | 8 | 16 | 10 | 2 |
| 04 | Methods & Reusability | 6 | 14 | 10 | 2 |
| 05 | Collections | 7 | 15 | 10 | 2 |
| 06 | Object-Oriented Programming | 11 | 16 | 12 | 2 |
| 07 | Exception Handling | 5 | 12 | 10 | 2 |
| 08 | Files & Serialization | 5 | 12 | 10 | 2 |
| 09 | Delegates, Events & Lambdas | 5 | 15 | 10 | 2 |
| 11 | Generics & LINQ | 8 | 14 | 10 | 2 |
| 12 | Async & Await | 6 | 14 | 10 | 2 |
| 13 | Databases & EF Core | 7 | 14 | 10 | 2 |
| 14 | Building a Web API | 8 | 14 | 10 | 2 |
| 15 | Testing & Design Patterns | 6 | 14 | 10 | 2 |

**Totals shipped: 82 lessons · 170 quiz Qs · 122 practice · 24 projects.** Every topic SHIP-rated by an adversarial compiler-review agent.

## In progress ⏳
- **16 · Job Prep & Capstone** — algorithms, mock interviews, capstone project.

## Queued
- Migrate Topics 10, 09: Delegates/Events/Lambdas, Conventions (add quiz/practice/projects)
- Migrate Topics 01–03: Foundations, Control Flow, Loops (add quiz/practice/projects)

## Notes
- All work is isolated on `course-buildout`; `main` (your Supabase auth/Admin feature) is untouched. Merge when ready.
- Reminder: gitignore `.env` on `main` before committing your auth work.
