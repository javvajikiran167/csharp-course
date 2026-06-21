import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "task",
  "number": 2,
  "title": "Task & Task<T>",
  "objective": "Understand Task as the fundamental async unit — what it represents, how to create one, and the difference between Task (no result) and Task<T> (returns a value).",
  "blocks": [
    {
      "kind": "lead",
      "text": "Before you can write a single `await`, you need to understand what you are awaiting. In C# async programming, the answer is almost always a **`Task`**. A `Task` is the runtime object that represents \"work that is happening — or will happen — asynchronously.\" Think of it as a promise: the method hands you back a `Task` immediately, and the actual result (or error) will be delivered into that object when the work completes. Everything else in async C# — `await`, `WhenAll`, `WhenAny`, `CancellationToken` — is built on top of this one concept."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students from Python often conflate Task with Python's coroutine object. Emphasise early: a Task may already be running on a ThreadPool thread when you receive it. A Python coroutine does nothing until awaited or scheduled.",
        "Draw the analogy to a ticket at a deli counter: the ticket IS the Task. The food being prepared in the back is the async work. You can hold the ticket, hand it to someone else, or wait for your number to be called.",
        "Cover Task vs Task<T> as the primary distinction — this is the question students ask most in the first hour.",
        "Show Task.FromResult and Task.CompletedTask early; students are surprised you can have a Task that is already completed.",
        "The three states (Running/Pending, RanToCompletion, Faulted/Canceled) are worth drawing on a whiteboard before showing code.",
        "Warn that .Result and .Wait() exist and look tempting — plant the deadlock seed now even if you cover it fully in a later lesson.",
        "All code blocks in this lesson use top-level statements (C# 9+) with local functions. Local async functions may not have access modifiers (public/static). This is intentional — it keeps the demos concise. In production you would place these methods inside a class."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What Is a Task?",
      "id": "what-is-a-task"
    },
    {
      "kind": "paragraph",
      "text": "A `Task` (in the `System.Threading.Tasks` namespace) is a **future** — a handle to an asynchronous operation. When an async method starts, it returns a `Task` to the caller right away, long before the work inside finishes. The caller can choose to `await` that `Task` (suspending until it completes), pass it around, combine it with other tasks, or attach a timeout to it. The `Task` object tracks three possible states:"
    },
    {
      "kind": "list",
      "items": [
        "**Running / WaitingForActivation** — the work is in progress (or waiting to be scheduled on the ThreadPool).",
        "**RanToCompletion** — the work finished successfully. If it was a `Task<T>`, the result is now available.",
        "**Faulted or Canceled** — the work ended with an exception, or was cancelled via a `CancellationToken`."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python comparison",
      "text": "In Python, `asyncio.create_task(coro())` returns a `Task` that is scheduled on the event loop and starts running immediately. C# `Task` works the same way — when you call an `async` method, the code inside starts running synchronously until the first `await` point, and the returned `Task` is already live. Unlike a Python coroutine object (which is inert until scheduled), a C# `Task` may already be progressing on another thread by the time you hold it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Task vs Task<T> — No Result vs a Result",
      "id": "task-vs-task-t"
    },
    {
      "kind": "paragraph",
      "text": "C# gives you two flavours depending on whether your async operation produces a value:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Task — no return value",
          "items": [
            "Equivalent to `async def f() -> None` in Python.",
            "Use when the operation is a side-effect: write a file, send an email, save to a database.",
            "Awaiting it gives you nothing back — you just wait for it to finish.",
            "Example signatures: `Task SaveAsync()`, `Task SendEmailAsync(string to)`"
          ]
        },
        {
          "title": "Task<T> — returns a value",
          "items": [
            "Equivalent to Python's `async def f() -> T`.",
            "Use when the operation produces data: fetch a URL, read a file, query a database.",
            "Awaiting it gives you the value of type `T`.",
            "Example signatures: `Task<string> FetchPageAsync(string url)`, `Task<int> CountRowsAsync()`"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Writing Your First Async Methods",
      "id": "first-async-methods"
    },
    {
      "kind": "paragraph",
      "text": "Let's write the two flavours side by side. The `async` modifier on a method signature is what enables `await` inside the body — and the compiler automatically wraps your return value in the right `Task` type. The code below uses C# top-level statements with **local async functions**, which is the most concise way to explore these concepts in a single file."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "TaskDemo.cs",
      "code": "using System;\nusing System.Net.Http;\nusing System.Threading.Tasks;\n\n// Local async functions — no public/static modifiers at file scope.\n// In production code these would be methods inside a class.\n\n// Task — no return value\n// \"Do this work asynchronously, tell me when you're done.\"\nasync Task SaveGreetingAsync(string name)\n{\n    // Simulate writing to a file or database (100 ms of I/O)\n    await Task.Delay(TimeSpan.FromMilliseconds(100));\n    Console.WriteLine($\"Saved greeting for {name}\");\n}\n\n// Task<string> — returns a value\n// \"Fetch this page and give me the content when it arrives.\"\n// NOTE: HttpClient is created here for demo brevity.\n// In production, inject IHttpClientFactory instead — see the HttpClient lesson.\nasync Task<string> FetchHomepageAsync(string url)\n{\n    using var http = new HttpClient();\n    string html = await http.GetStringAsync(url);\n    return html[..200]; // first 200 characters\n}\n\n// --- Entry point (top-level statements) ---\n\n// Awaiting Task — we get nothing back, just wait for completion\nawait SaveGreetingAsync(\"Alice\");\n\n// Awaiting Task<string> — we get the string back directly\nstring snippet = await FetchHomepageAsync(\"https://example.com\");\nConsole.WriteLine($\"First 200 chars: {snippet.Length} characters received\");"
    },
    {
      "kind": "output",
      "output": "Saved greeting for Alice\nFirst 200 chars: 200 characters received",
      "label": "Console output"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Pre-Completed Tasks — FromResult and CompletedTask",
      "id": "pre-completed-tasks"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes you are implementing an interface or overriding a base class that demands a `Task` return type, but your implementation happens to have the answer right now — no I/O needed. Creating a whole async state machine just to return a constant value is wasteful. The runtime gives you two lightweight helpers for this exact situation. The class definition lives in its own file; the usage code goes in `Program.cs`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CachingService.cs",
      "code": "using System.Collections.Generic;\nusing System.Threading.Tasks;\n\npublic class CachingService\n{\n    private readonly Dictionary<string, string> _cache = new()\n    {\n        [\"greeting\"] = \"Hello, world!\"\n    };\n\n    // Task.FromResult<T> — wraps an already-known value in a completed Task<T>.\n    // No async keyword needed; no state machine generated; zero extra allocation.\n    public Task<string> GetCachedValueAsync(string key)\n    {\n        if (_cache.TryGetValue(key, out string? value))\n            return Task.FromResult(value);       // already done — synchronous fast path\n\n        return FetchFromDatabaseAsync(key);      // real async path\n    }\n\n    // Task.CompletedTask — a singleton already-completed Task (no return value).\n    // Use when your Task-returning method has nothing to do right now.\n    public Task WarmUpAsync()\n    {\n        // Cache already warm — nothing to do\n        return Task.CompletedTask;\n    }\n\n    private async Task<string> FetchFromDatabaseAsync(string key)\n    {\n        await Task.Delay(50); // simulate DB round-trip\n        return $\"[DB result for '{key}']\";\n    }\n}"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var svc = new CachingService();\n\nstring val = await svc.GetCachedValueAsync(\"greeting\");\nConsole.WriteLine(val);\n\nstring missing = await svc.GetCachedValueAsync(\"missing\");\nConsole.WriteLine(missing);"
    },
    {
      "kind": "output",
      "output": "Hello, world!\n[DB result for 'missing']",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer Task.FromResult and Task.CompletedTask in stub implementations",
      "text": "When you mock an interface in a test, or implement a no-op version of an async interface method, always return `Task.CompletedTask` or `Task.FromResult(value)` instead of marking the method `async` and leaving the body empty. An empty `async` method still allocates a state machine object. `Task.CompletedTask` is a **singleton** — it is literally the same object reused every time, with zero allocation cost."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Reading the Result Without await — and Why You Usually Shouldn't",
      "id": "result-without-await"
    },
    {
      "kind": "paragraph",
      "text": "Every `Task<T>` exposes a `.Result` property and a `.Wait()` method (on `Task`) that block the calling thread until the operation finishes. They exist, and you will see them in older code. You need to know what they do — and why you should almost always reach for `await` instead. The example below uses local functions so the contrast is clear in one file."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ResultVsAwait.cs",
      "code": "using System;\nusing System.Threading.Tasks;\n\n// A genuinely async operation — returns a pending Task<string> because of Task.Delay.\nasync Task<string> GetDataAsync()\n{\n    await Task.Delay(200); // 200 ms of async I/O\n    return \"hello\";\n}\n\n// CORRECT — await suspends this method without blocking the thread.\n// The thread is returned to the pool for those 200 ms.\nasync Task GoodAsync()\n{\n    string result = await GetDataAsync();\n    Console.WriteLine(result);\n}\n\n// RISKY — .Result blocks the calling thread for the full 200 ms.\n// In a console app this wastes a thread; in a UI app or ASP.NET classic it can deadlock.\nvoid RiskySync()\n{\n    string result = GetDataAsync().Result; // calling thread is frozen here\n    Console.WriteLine(result);\n}\n\n// Entry point\nawait GoodAsync();\nRiskySync();"
    },
    {
      "kind": "output",
      "output": "hello\nhello",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The .Result deadlock trap",
      "text": "In environments that have a `SynchronizationContext` — WinForms, WPF, and classic ASP.NET (.NET Framework) — calling `.Result` or `.Wait()` on a **pending** Task from the UI or request thread **deadlocks**. Here is why: `.Result` blocks that thread while waiting for the Task to finish. The Task's continuation needs to post back to that same thread to resume. But that thread is blocked. Neither side can proceed. The app hangs forever. The fix is to **go async all the way** — never block on a Task in the middle of an async call chain. (ASP.NET Core does not have a `SynchronizationContext`, so `.Result` won't deadlock there — but it still wastes a ThreadPool thread and hurts throughput under load. The rule stands.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Real-World Example — Aggregating Multiple API Calls",
      "id": "real-world-example"
    },
    {
      "kind": "paragraph",
      "text": "Here is a pattern you will write constantly in production ASP.NET Core services: call several independent async operations and collect all their results. This example fetches a user profile and their order count from two separate services. Notice how the `Task<T>` return types let us start both operations immediately, hold the `Task` objects, and only then collect results — cutting total latency from ~140 ms (sequential) to ~80 ms (parallel)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "DashboardService.cs",
      "code": "using System.Threading;\nusing System.Threading.Tasks;\n\npublic record UserProfile(string Name, string Email);\npublic record DashboardData(UserProfile Profile, int OrderCount);\n\npublic class DashboardService\n{\n    // Both of these simulate real async I/O (DB or HTTP)\n    private static async Task<UserProfile> GetProfileAsync(int userId, CancellationToken ct)\n    {\n        await Task.Delay(80, ct); // simulate 80 ms DB query\n        return new UserProfile($\"User#{userId}\", $\"user{userId}@example.com\");\n    }\n\n    private static async Task<int> GetOrderCountAsync(int userId, CancellationToken ct)\n    {\n        await Task.Delay(60, ct); // simulate 60 ms DB query\n        return 42;\n    }\n\n    public static async Task<DashboardData> LoadDashboardAsync(\n        int userId,\n        CancellationToken cancellationToken = default)\n    {\n        // Start BOTH tasks immediately — do NOT await yet.\n        // At this point both delays are already ticking in parallel.\n        Task<UserProfile> profileTask    = GetProfileAsync(userId, cancellationToken);\n        Task<int>         orderCountTask = GetOrderCountAsync(userId, cancellationToken);\n\n        // Now collect results — total wall time ~80 ms (parallel), not ~140 ms (sequential).\n        UserProfile profile    = await profileTask;\n        int         orderCount = await orderCountTask;\n\n        return new DashboardData(profile, orderCount);\n    }\n}"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\n\nvar data = await DashboardService.LoadDashboardAsync(userId: 7);\nConsole.WriteLine($\"Name:   {data.Profile.Name}\");\nConsole.WriteLine($\"Email:  {data.Profile.Email}\");\nConsole.WriteLine($\"Orders: {data.OrderCount}\");"
    },
    {
      "kind": "output",
      "output": "Name:   User#7\nEmail:  user7@example.com\nOrders: 42",
      "label": "Console output"
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A `Task` is a **future** — a handle to an in-progress async operation. It is not a coroutine; it may already be running when you receive it.",
        "`Task` (no type parameter) represents async work with **no return value** — like `void` but awaitable. Use it for side-effects: save, send, delete.",
        "`Task<T>` represents async work that **produces a value of type T**. Awaiting it gives you the result directly.",
        "`Task.CompletedTask` is a singleton already-finished `Task`. `Task.FromResult(value)` creates an already-finished `Task<T>`. Both avoid unnecessary state machine allocation in synchronous fast paths.",
        "**Never** use `.Result` or `.Wait()` on a pending Task in the middle of an async call chain in UI apps or classic ASP.NET — it deadlocks. In ASP.NET Core it won't deadlock but wastes a thread. Always prefer `await`.",
        "Hold `Task<T>` objects before awaiting them to run independent operations in parallel — a fundamental async performance technique you will use daily."
      ]
    }
  ]
};
