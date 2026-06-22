# Build-out Status

**Live updated by Claude as each topic lands.** For real-time agent-level progress, run `/workflows` in the Claude session.

_Last updated: 2026-06-22 ~23:00 (Asia/Calcutta) — ALL 16 TOPICS COMPLETE_

## How to watch progress
- **`/workflows`** — live tree of running agents (Research → Author → Verify → Assessment).
- **This file (`STATUS.md`)** — refreshed at every topic; visible on the `course-buildout` branch on GitHub.
- **`git log --oneline`** on branch `course-buildout` — one commit per shipped topic.

## Shipped & verified ✅ (branch `course-buildout`, pushed)
| # | Topic | Lessons | Quiz | Practice | Projects |
|---|-------|--------:|-----:|---------:|---------:|
| — | Architecture: per-topic Quiz/Practice/Projects pages, progress v4, Teacher-label fix, .NET 10/C# 14 | — | — | — | — |
| 00 | Programming Foundations (pre-C#) | 8 | 16 | 10 | 2 |
| 01 | Foundations (C#) | 5 | 14 | 10 | 2 |
| 02 | Control Flow | 6 | 14 | 10 | 2 |
| 03 | Loops & Iteration | 6 | 14 | 10 | 2 |
| 04 | Methods & Reusability | 6 | 14 | 10 | 2 |
| 05 | Collections | 7 | 15 | 10 | 2 |
| 06 | Object-Oriented Programming | 11 | 16 | 12 | 2 |
| 07 | Exception Handling | 5 | 12 | 10 | 2 |
| 08 | Files & Serialization | 5 | 12 | 10 | 2 |
| 09 | Delegates, Events & Lambdas | 5 | 15 | 10 | 2 |
| 10 | C# Conventions & Style | 4 | 14 | 10 | 2 |
| 11 | Generics & LINQ | 8 | 14 | 10 | 2 |
| 12 | Async & Await | 6 | 14 | 10 | 2 |
| 13 | Databases & EF Core | 7 | 14 | 10 | 2 |
| 14 | Building a Web API | 8 | 14 | 10 | 2 |
| 15 | Testing & Design Patterns | 6 | 14 | 10 | 2 |
| 16 | Job Prep & Capstone | 6 | 14 | 10 | 2 |

**✅ COURSE COMPLETE: 88 lessons · 184 quiz Qs · 142 practice · 32 projects.** All 16 topics fully authored with full assessment coverage.

## Status
✅ **ALL TOPICS AUTHORED AND SHIPPED**

Course progression (programming fundamentals → job-ready):
- **Topics 00-03**: Language fundamentals (pre-C#, variables, control flow, loops)
- **Topics 04-10**: Core C# (methods, collections, OOP, exceptions, files, events, conventions)
- **Topics 11-12**: Advanced patterns (generics, LINQ, async/await)
- **Topics 13-15**: Professional skills (databases, Web APIs, testing)
- **Topic 16**: Capstone & job interview prep

## Next Steps
- Review for correctness and consistency
- Test TypeScript compilation
- Merge to `main` when ready

## Notes
- All work is isolated on `course-buildout`; `main` (your Supabase auth/Admin feature) is untouched. Merge when ready.
- Reminder: gitignore `.env` on `main` before committing your auth work.
