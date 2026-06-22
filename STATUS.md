# Build-out Status

**Live updated by Claude as each topic lands.** For real-time agent-level progress, run `/workflows` in the Claude session.

_Last updated: 2026-06-22 ~21:15 (Asia/Calcutta)_

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

**Totals shipped: 68 lessons · 142 quiz Qs · 102 practice · 20 projects.** Every topic SHIP-rated by an adversarial compiler-review agent.

## In progress ⏳
- **14 · Building a Web API** — REST APIs with ASP.NET Core.

## Queued
- Topic 15: Testing & Design Patterns
- Topic 16: Job Prep & Capstone
- Topics 10, 09: Delegate/Events/Lambdas, C# Conventions (migrate to new structure)
- Topics 01–03: Foundations, Control Flow, Loops (migrate to new structure)

## Notes
- All work is isolated on `course-buildout`; `main` (your Supabase auth/Admin feature) is untouched. Merge when ready.
- Reminder: gitignore `.env` on `main` before committing your auth work.
