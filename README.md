# C# Course — from "what is a program?" to job-ready .NET

A **free, self-paced C# course** that takes a complete beginner — including
people coming from Python or no programming background at all — all the way to a
**job-ready .NET developer**. Every lesson works two ways: as a script a teacher
can teach live from, and as standalone reading a student can self-study.

**▶ Live site: https://javvajikiran167.github.io/csharp-course/**

Built and taught by **Kiran Javvaji**, targeting modern **.NET 10 / C# 14**.

---

## What's inside

**16 topics · 88 lessons · 184 quiz questions · 142 practice problems · 32 projects.**

Every concept is tied to a real-world scenario and the industry best practice,
written in the voice of an engineer who has shipped production C#.

| Stage | Topics |
|-------|--------|
| **Fundamentals** | Programming Foundations (pre-C#), Foundations of C#, Control Flow, Loops |
| **Core C#** | Methods, Collections, Object-Oriented Programming, Exceptions, Files & Serialization, Delegates/Events/Lambdas, Conventions & Style |
| **Advanced** | Generics & LINQ, Async & Await |
| **Professional** | Databases & EF Core, Building a Web API, Testing & Design Patterns |
| **Capstone** | Job Prep & Capstone |

Each topic has dedicated **Quiz** and **Practice** pages, plus **2 projects** of
escalating difficulty. Progress is tracked per lesson, so re-ordering never wipes
a student's history.

---

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Supabase** for student logins and per-chapter access control
- Deployed as a static build to **GitHub Pages** (CI in `.github/workflows/`)

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
```

Copy `.env.example` to `.env` and fill in your Supabase values if you want auth
to work locally. The public Supabase keys are safe to commit — access is enforced
server-side by Row Level Security.

## For instructors

The course supports student logins with chapters you unlock one at a time as the
class progresses. See **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)** for creating students,
releasing chapters, and handling unlock requests.

---

## Get in touch

Questions, feedback, a typo you spotted, or want to use this with your own class?
**I'd love to hear from you** — please reach out:

- **LinkedIn:** [linkedin.com/in/kiranjavvaji](https://www.linkedin.com/in/kiranjavvaji/)
- **Email:** [javvajikiran167@gmail.com](mailto:javvajikiran167@gmail.com)

If this course helped you, a note or a connection on LinkedIn means a lot. 🙏

---

*Crafted by Kiran Javvaji. Free to learn from — please keep it free.*
