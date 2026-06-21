import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "pitfalls",
  "number": 4,
  "title": "Common Async Pitfalls",
  "objective": "Avoid the four deadly async mistakes: async void, .Result/.Wait() deadlocks, fire-and-forget leaks, and the sync-over-async anti-pattern.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Async code unlocks serious performance gains — but four specific mistakes will sabotage you. They do not always blow up immediately; some deadlock silently under load, some crash the process minutes later, and some waste threads so quietly you only notice in production. In this lesson you will learn to recognise each pitfall by name, understand exactly *why* it breaks, and apply the fix with confidence."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students from Python rarely encounter these exact failure modes because asyncio's single-threaded event loop and coroutine model handles cancellation and exceptions differently. Frame each pitfall as 'here is why C# diverges from what you expect.'",
        "Pitfall 1 (async void) lands hardest with Python devs who think 'fire and forget' is fine — they are used to asyncio.create_task() which at least keeps a reference. Make the process-crash demo visceral.",
        "Pitfall 2 (.Result deadlock) is context-dependent; it does NOT deadlock in ASP.NET Core. Emphasise the environment table so students know when they are safe and when they are not.",
        "Pitfall 3 (fire-and-forget) is subtle — the code looks fine until exceptions disappear. Show the logging pattern as the acceptable minimal fix.",
        "Pitfall 4 (sync-over-async) is the 'escape hatch' developers reach for first. Hammer home that it is not a fix — it is a different bug.",
        "The lesson works best if you live-code pitfall 1 and 2 and let students trigger the crash/deadlock themselves before revealing the fix."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Pitfall 1 — async void: the Unobservable Crash",
      "id": "async-void"
    },
    {
      "kind": "paragraph",
      "text": "When you write `async void`, the C# compiler still generates a state machine — but it wraps the state machine in a `void`-returning method. That means the caller gets **nothing back**: no `Task`, no handle, no way to observe whether the work succeeded or failed. When an exception escapes the state machine, the runtime posts it to the `SynchronizationContext` that was active at the point the method was called. If no `SynchronizationContext` exists — as in a console app or ASP.NET Core — the exception is raised directly on the `ThreadPool`, which triggers `AppDomain.UnhandledException` and **crashes the entire process** in .NET 10."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Wrong — async void",
          "items": [
            "`async void SendEmailAsync()` — no Task returned",
            "Caller cannot await it",
            "Exception crashes the process or posts unhandled to SynchronizationContext",
            "No way to know when it finishes"
          ]
        },
        {
          "title": "Right — async Task",
          "items": [
            "`async Task SendEmailAsync()` — Task returned",
            "Caller can await it and observe completion",
            "Exception propagates normally through await",
            "Caller controls lifetime and error handling"
          ]
        }
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "AsyncVoidDemo.cs",
      "code": "// WRONG — async void swallows exceptions and can crash the process\npublic async void SendWelcomeEmailAsync(string address)\n{\n    await Task.Delay(500);            // simulates SMTP latency\n    throw new InvalidOperationException(\"SMTP server unreachable\");\n    // ^ this exception is NOT catchable by the caller;\n    //   it surfaces on the ThreadPool and terminates the process.\n}\n\n// Caller looks innocent:\npublic void OnUserRegistered(string email)\n{\n    SendWelcomeEmailAsync(email);     // fire and (pretend to) forget\n    Console.WriteLine(\"Registration complete\"); // prints before exception fires\n}\n\n// ------------------------------------------------------------------\n// RIGHT — return Task so callers can await and catch\npublic async Task SendWelcomeEmailCorrectAsync(string address)\n{\n    await Task.Delay(500);\n    throw new InvalidOperationException(\"SMTP server unreachable\");\n    // ^ now the exception lives inside the returned Task\n}\n\npublic async Task OnUserRegisteredAsync(string email)\n{\n    try\n    {\n        await SendWelcomeEmailCorrectAsync(email); // exception surfaces here\n    }\n    catch (InvalidOperationException ex)\n    {\n        Console.WriteLine($\"Email failed: {ex.Message}\"); // handled gracefully\n    }\n    Console.WriteLine(\"Registration complete\");\n}"
    },
    {
      "kind": "output",
      "output": "Email failed: SMTP server unreachable\nRegistration complete",
      "label": "Output of OnUserRegisteredAsync (correct async Task version)"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The one acceptable use of async void",
      "text": "UI event handlers in WinForms, WPF, and MAUI *must* return `void` because the framework calls them through a delegate typed as `EventHandler`. Even there, **always** wrap the entire body in `try/catch` — an unhandled exception in an `async void` event handler will still crash the process. In ASP.NET Core, gRPC hubs, background workers, and libraries: `async void` is never acceptable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Pitfall 2 — .Result and .Wait(): the Synchronous Deadlock",
      "id": "result-wait-deadlock"
    },
    {
      "kind": "paragraph",
      "text": "When you call `.Result` or `.Wait()` on a `Task`, you **block the calling thread** until the task finishes. In environments that have a `SynchronizationContext` — WinForms, WPF, ASP.NET Framework — this creates a classic deadlock. The blocked thread is the *same* thread the continuation needs to resume on. Both sides wait forever."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "DeadlockDemo.cs",
      "code": "// Imagine this running on a WinForms UI thread (SynchronizationContext is active)\n\n// WRONG — deadlocks on UI thread or in ASP.NET classic\npublic string LoadUserName(int id)\n{\n    // .Result blocks the UI thread here\n    return FetchUserNameAsync(id).Result;  // DEADLOCK on UI/ASP.NET classic\n}\n\npublic async Task<string> FetchUserNameAsync(int id)\n{\n    // The await captures the UI SynchronizationContext.\n    // When Task.Delay finishes, the runtime tries to Post() the\n    // continuation back to the UI thread — but the UI thread is\n    // blocked in .Result above. Neither side can proceed.\n    await Task.Delay(100);\n    return $\"User_{id}\";\n}\n\n// ------------------------------------------------------------------\n// RIGHT — async all the way up the call stack\npublic async Task<string> LoadUserNameAsync(int id)\n{\n    return await FetchUserNameAsync(id);  // no blocking, no deadlock\n}\n\n// ------------------------------------------------------------------\n// ALSO WORKS in library code — use ConfigureAwait(false) so the\n// continuation never needs to return to the captured context\npublic async Task<string> FetchUserNameLibraryAsync(int id)\n{\n    await Task.Delay(100).ConfigureAwait(false); // context not captured\n    return $\"User_{id}\";\n    // Now a caller on a context-owning thread CAN call .Result without deadlock\n    // — but prefer async all the way.\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Does .Result deadlock in ASP.NET Core?",
      "text": "ASP.NET Core deliberately does **not** install a `SynchronizationContext`, so `.Result` and `.Wait()` will not deadlock there. However, they still **block a ThreadPool thread** for the entire duration of the async operation. Under load, this starves the ThreadPool and collapses throughput. The rule stands: never block on async code, even where deadlock is not the immediate risk."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Pitfall 3 — Fire-and-Forget Without Error Handling",
      "id": "fire-and-forget"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes you genuinely do not want to await a background operation — sending a webhook, writing an audit log, warming a cache. The temptation is to discard the `Task` entirely. The problem: if that task faults, **the exception silently disappears**. You have no idea the work failed. In .NET 10, unobserved task exceptions no longer crash the process (the `UnobservedTaskException` crash behaviour was removed back in .NET 4.5), but that makes them *more* dangerous — they just vanish."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "FireAndForget.cs",
      "code": "using Microsoft.Extensions.Logging;\n\npublic class AuditService\n{\n    private readonly ILogger<AuditService> _logger;\n\n    public AuditService(ILogger<AuditService> logger)\n    {\n        _logger = logger;\n    }\n\n    // WRONG — exception silently vanishes; you never know the audit write failed\n    public void RecordAuditEventWrong(string action)\n    {\n        _ = WriteAuditAsync(action); // discard Task — exceptions go nowhere\n    }\n\n    // RIGHT — attach a continuation that at minimum logs the fault\n    public void RecordAuditEvent(string action)\n    {\n        _ = WriteAuditAsync(action)\n            .ContinueWith(\n                t => _logger.LogError(t.Exception, \"Audit write failed for action {Action}\", action),\n                TaskContinuationOptions.OnlyOnFaulted);\n    }\n\n    // EVEN BETTER — use the reusable FireAndForget helper (defined below)\n    public void RecordAuditEventBest(string action)\n    {\n        WriteAuditAsync(action).FireAndForget(_logger, context: $\"audit:{action}\");\n    }\n\n    private static async Task WriteAuditAsync(string action)\n    {\n        await Task.Delay(200); // simulate I/O\n        // imagine a real database write here\n    }\n}\n\n// ------------------------------------------------------------------\n// Reusable extension — put this in a shared utilities project\npublic static class TaskExtensions\n{\n    public static void FireAndForget(this Task task, ILogger logger, string context = \"\")\n    {\n        task.ContinueWith(\n            t => logger.LogError(\n                t.Exception,\n                \"Unhandled exception in fire-and-forget task. Context: {Context}\",\n                context),\n            TaskContinuationOptions.OnlyOnFaulted);\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer BackgroundService over raw fire-and-forget",
      "text": "If your fire-and-forget work is recurring or important enough to notice when it fails, model it as a `BackgroundService` or use `IHostedService`. The host owns the `Task`, handles shutdown gracefully via `CancellationToken`, and surfaces exceptions through the structured logging pipeline. Raw `_ = SomeAsync()` is a last resort, not a pattern."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Pitfall 4 — Sync-over-Async: The ThreadPool Trap",
      "id": "sync-over-async"
    },
    {
      "kind": "paragraph",
      "text": "When developers first hit a situation where they *must* call async code from a synchronous method — perhaps a legacy interface or a property getter — the instinct is to reach for `.GetAwaiter().GetResult()` or `Task.Run(...).Result` as an \"escape hatch.\" Both approaches are problematic in different ways, and neither is a real fix."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "SyncOverAsync.cs",
      "code": "// WRONG — .GetAwaiter().GetResult() is just .Result with nicer exception unwrapping.\n// Still blocks. Still deadlocks on UI/ASP.NET classic SynchronizationContext.\npublic string GetCurrentWeather(string city)\n{\n    return FetchWeatherAsync(city).GetAwaiter().GetResult(); // blocks thread\n}\n\n// WRONG — Task.Run offloads to the ThreadPool, avoiding the SynchronizationContext\n// deadlock, but STILL blocks a ThreadPool thread for the entire I/O duration.\n// Under load in ASP.NET Core this still starves the thread pool.\npublic string GetCurrentWeatherV2(string city)\n{\n    return Task.Run(() => FetchWeatherAsync(city)).Result; // wastes two threads\n}\n\n// ------------------------------------------------------------------\n// RIGHT — make the calling method async too. \"Async all the way\" is\n// the only complete solution. Refactor the interface if necessary.\npublic async Task<string> GetCurrentWeatherAsync(string city)\n{\n    return await FetchWeatherAsync(city);\n}\n\n// ------------------------------------------------------------------\n// ONLY ACCEPTABLE synchronous entry point: the very top of the call stack.\n// Console apps with async Main avoid even this:\n//\n// static async Task Main(string[] args)   // C# 7.1+ — preferred\n// {\n//     string weather = await GetCurrentWeatherAsync(\"London\");\n//     Console.WriteLine(weather);\n// }\n\nprivate static async Task<string> FetchWeatherAsync(string city)\n{\n    await Task.Delay(300); // simulate HTTP call\n    return $\"Sunny in {city}\";\n}"
    },
    {
      "kind": "output",
      "output": "Sunny in London",
      "label": "Output of GetCurrentWeatherAsync(\"London\") via async Main"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Task.Run does not fix sync-over-async in ASP.NET Core",
      "text": "A common misconception: wrapping an async call in `Task.Run` and blocking on it \"works\" in ASP.NET Core because there is no `SynchronizationContext` deadlock. True — it avoids the deadlock. But it uses **two** ThreadPool threads (one blocked in `.Result`, one doing the I/O work) for work that should need zero blocking threads. Under high request load, this halves effective throughput. The fix is always the same: propagate `async`/`await` up the call stack."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Quick Reference: Four Pitfalls at a Glance",
      "id": "quick-reference"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**async void** — exceptions are unobservable and crash the process. Fix: return `Task` instead. Exception: UI event handlers — but always `try/catch` the body.",
        "**.Result / .Wait() / .GetAwaiter().GetResult()** — blocks a thread and deadlocks when a `SynchronizationContext` is present. Fix: go `async` all the way up the call stack.",
        "**Fire-and-forget without error handling** — faults silently disappear. Fix: attach `.ContinueWith(OnlyOnFaulted)` to log errors, or use `BackgroundService`.",
        "**Sync-over-async (Task.Run + .Result)** — wastes ThreadPool threads and throttles throughput under load. Fix: `async`/`await` all the way; use `async Task Main` in console apps."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`async void` is almost always wrong: the caller cannot await it, and exceptions crash the process. Always return `Task` from async methods; reserve `async void` for UI event handlers with a `try/catch` wrapping the whole body.",
        "Blocking with `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()` on a thread that owns a `SynchronizationContext` causes a deadlock. In ASP.NET Core there is no deadlock, but you still block a ThreadPool thread, hurting throughput.",
        "Discarding a `Task` with `_ = SomeAsync()` silently swallows exceptions. Always attach at minimum a `.ContinueWith(OnlyOnFaulted)` logger, or redesign as a `BackgroundService`.",
        "`Task.Run(() => AsyncMethod()).Result` avoids the deadlock but blocks two ThreadPool threads and is not an acceptable long-term solution. The real fix is `async` all the way up the call stack — even if that means refactoring legacy interfaces.",
        "In library and reusable code, use `ConfigureAwait(false)` on every `await` to prevent context-related deadlocks and remove unnecessary thread-switching overhead.",
        "Python devs: these pitfalls have no direct equivalent in asyncio because the single-threaded event loop makes blocking and context capture behave differently. Treat C# async as a genuinely different model."
      ]
    }
  ]
};
