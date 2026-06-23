import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';

export const asyncAwait: Topic = {
  slug: "async",
  title: "Async & Await",
  subtitle: "Write non-blocking code that scales — the foundation of every modern .NET web service.",
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          "id": "async-q1",
          "kind": "mcq",
          "prompt": "A synchronous ASP.NET Core controller action calls `File.ReadAllText(\"data.txt\")` to read a large file. What is the primary problem with this approach under high load?",
          "options": [
            {
              "label": "The file will be locked and other requests cannot read it simultaneously.",
              "correct": false
            },
            {
              "label": "The ThreadPool thread handling the request is blocked waiting for disk I/O, so it cannot serve other requests. Under load, all threads become blocked and the server stops responding.",
              "correct": true
            },
            {
              "label": "File I/O is not supported in ASP.NET Core — you must use a database instead.",
              "correct": false
            },
            {
              "label": "The method will throw an IOException because ASP.NET Core disables synchronous file access by default.",
              "correct": false
            }
          ],
          "explanation": "ASP.NET Core uses a ThreadPool with a limited number of threads. When a thread blocks on synchronous I/O (disk, network, database), it sits idle but is unavailable to serve other requests. Under high concurrency, all threads become blocked and the server queues or drops requests. The async equivalent — `await File.ReadAllTextAsync(\"data.txt\")` — releases the thread back to the pool while the OS waits for the disk, allowing the same thread to serve other requests during the wait. This is the core reason async/await exists: it multiplexes many concurrent operations over a small thread pool."
        },
        {
          "id": "async-q8",
          "kind": "predict",
          "prompt": "What does the following code print? Assume the network is fast and both requests succeed in ~100 ms each.",
          "code": "using System;\nusing System.Diagnostics;\nusing System.Net.Http;\nusing System.Threading.Tasks;\n\nvar sw = Stopwatch.StartNew();\nusing var http = new HttpClient();\n\n// Sequential\nvar r1 = await http.GetStringAsync(\"https://example.com\");\nvar r2 = await http.GetStringAsync(\"https://example.org\");\n\nConsole.WriteLine($\"Done in {sw.ElapsedMilliseconds} ms\");\n",
          "options": [
            {
              "label": "Done in ~100 ms (both requests run at the same time)",
              "correct": false
            },
            {
              "label": "Done in ~200 ms (requests run one after the other)",
              "correct": true
            },
            {
              "label": "Done in 0 ms (HttpClient caches responses)",
              "correct": false
            },
            {
              "label": "A compilation error — you cannot await two different HttpClient calls in the same method.",
              "correct": false
            }
          ],
          "explanation": "Awaiting each request before starting the next makes them sequential: the code waits for the first `GetStringAsync` to complete before even starting the second. Total time ≈ 100 ms + 100 ms = 200 ms. To run them in parallel you must start both tasks BEFORE awaiting either: `var t1 = http.GetStringAsync(\"https://example.com\"); var t2 = http.GetStringAsync(\"https://example.org\"); await Task.WhenAll(t1, t2);` — total time ≈ 100 ms because both requests fly concurrently. This sequential-vs-parallel distinction is one of the most impactful async performance decisions you will make."
        }
      ],
      challenges: [
        {
          "id": "async-p1",
          "difficulty": "easy",
          "title": "Spot the Blocking Code",
          "prompt": "You are reviewing a junior developer's ASP.NET Core controller. They wrote a method that calls a slow database query:\n\n```csharp\n[HttpGet(\"/orders/{id}\")]\npublic IActionResult GetOrder(int id)\n{\n    var order = _db.Orders\n                   .Where(o => o.Id == id)\n                   .FirstOrDefault(); // synchronous\n    return Ok(order);\n}\n```\n\n**Part A.** Explain in your own words what happens to the .NET ThreadPool thread that handles this HTTP request while `FirstOrDefault()` is waiting for the database to respond. Why does this become a problem when 500 users hit the endpoint simultaneously?\n\n**Part B.** Rewrite the method signature and body to be fully async. Use `FirstOrDefaultAsync` (EF Core). Add a `CancellationToken` parameter so the query is cancelled if the client disconnects. Show the complete corrected method.\n\n**Part C.** After your rewrite, what is the thread doing while the database query runs? How many simultaneous requests can the server now handle compared to the blocking version?",
          "hints": [
            "A blocked ThreadPool thread cannot be reused for other requests — it just sits idle, burning a slot.",
            "The async signature needs to return `Task<IActionResult>` and be marked `async`.",
            "ASP.NET Core automatically binds `HttpContext.RequestAborted` into a `CancellationToken` parameter on action methods — you don't need to extract it manually.",
            "After `await`, the thread is returned to the pool and can serve other requests while the I/O completes."
          ]
        }
      ]
    },
    {
      ...lesson02,
      questions: [
        {
          "id": "async-q2",
          "kind": "mcq",
          "prompt": "Which statement best describes what a `Task<string>` represents in .NET 10?",
          "options": [
            {
              "label": "A background thread that will eventually produce a string value.",
              "correct": false
            },
            {
              "label": "A coroutine object that must be explicitly scheduled on an event loop, similar to Python's asyncio coroutine.",
              "correct": false
            },
            {
              "label": "A future-like object representing an asynchronous operation that will eventually produce a string — the operation may already be running on a ThreadPool thread.",
              "correct": true
            },
            {
              "label": "A wrapper around a string that adds thread-safety via a lock.",
              "correct": false
            }
          ],
          "explanation": "`Task<T>` is the fundamental async unit in .NET. Unlike a Python coroutine (which is lazy — it doesn't start until you schedule it), a `Task` typically represents work that is already in progress. You can think of `Task<string>` as a promise: 'I will eventually give you a string.' The runtime may use the ThreadPool to run the work, but `Task<T>` itself is not a thread — it is just the object that tracks the operation's status and holds the eventual result. When you `await` it, you subscribe to a callback that fires when the result is ready."
        },
        {
          "id": "async-q15",
          "kind": "predict",
          "prompt": "What are the exact three lines this program prints?",
          "code": "using System;\nusing System.Threading.Tasks;\n\nTask<int> t1 = Task.FromResult(42);\nTask t2 = Task.CompletedTask;\n\nConsole.WriteLine($\"t1 status: {t1.Status}\");\nConsole.WriteLine($\"t1 result: {t1.Result}\");\nConsole.WriteLine($\"t2 status: {t2.Status}\");\n",
          "options": [
            {
              "label": "t1 status: RanToCompletion / t1 result: 42 / t2 status: RanToCompletion",
              "correct": true
            },
            {
              "label": "t1 status: Running / t1 result: 0 / t2 status: Running",
              "correct": false
            },
            {
              "label": "The program deadlocks on `t1.Result` because the task has not been awaited.",
              "correct": false
            },
            {
              "label": "t1 status: WaitingForActivation / t1 result: 42 / t2 status: Faulted",
              "correct": false
            }
          ],
          "explanation": "`Task.FromResult(42)` and `Task.CompletedTask` both return tasks that are ALREADY finished, so their status is `RanToCompletion` immediately. Calling `.Result` on an already-completed `Task<T>` does NOT block or deadlock — the value (42) is already present, so it returns instantly. This is why `Task.FromResult` and `Task.CompletedTask` are the idiomatic way to return a completed task from a method that has no real asynchronous work to do (for example, an interface implementation or a cache hit)."
        }
      ],
      challenges: [
        {
          "id": "async-p2",
          "difficulty": "easy",
          "title": "Task and Task<T> Fundamentals",
          "prompt": "Answer the following three exercises about `Task` and `Task<T>`.\n\n**Exercise 1 — Identify the return type.** For each scenario, state whether the async method should return `Task`, `Task<T>` (and name the T), or `ValueTask<T>`. Justify each choice.\n- A method that sends an email and does not need to report back any value.\n- A method that downloads a JSON string from an HTTP endpoint.\n- A method on a high-frequency trading system's hot path that reads a price from an in-memory cache (usually hits the cache without any real I/O).\n- A UI event handler wired to a WinForms button click.\n\n**Exercise 2 — Read this code and predict the output:**\n```csharp\nusing System;\nusing System.Threading.Tasks;\n\nTask<int> t1 = Task.FromResult(42);\nTask t2 = Task.CompletedTask;\n\nConsole.WriteLine($\"t1 status: {t1.Status}\");\nConsole.WriteLine($\"t1 result: {t1.Result}\");\nConsole.WriteLine($\"t2 status: {t2.Status}\");\n```\nWrite out the exact three lines the program prints.\n\n**Exercise 3 — Fix the bug.** The following method has a subtle return-type mistake:\n```csharp\npublic async Task<string> GetGreetingAsync(string name)\n{\n    await Task.Delay(10);\n    return $\"Hello, {name}!\";\n}\n\n// Caller:\nstring greeting = GetGreetingAsync(\"Ada\"); // compile error\nConsole.WriteLine(greeting);\n```\nExplain why this does not compile and show the corrected caller line.",
          "hints": [
            "A `Task` that has already finished (created via `Task.FromResult` or `Task.CompletedTask`) reports status `RanToCompletion`.",
            "Calling `.Result` on an already-completed `Task<T>` does NOT block or deadlock — it returns immediately because the value is already there.",
            "The caller needs `await` to unwrap the `Task<string>` into a plain `string`. The method itself is fine.",
            "Prefer `ValueTask<T>` only when the operation *frequently* completes synchronously — a cache layer is the textbook case."
          ]
        }
      ]
    },
    {
      ...lesson03,
      questions: [
        {
          "id": "async-q3",
          "kind": "predict",
          "prompt": "What does the following program print?",
          "code": "using System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        Console.WriteLine(\"A\");\n        await Task.Delay(0);\n        Console.WriteLine(\"B\");\n        Console.WriteLine(\"C\");\n    }\n}",
          "options": [
            {
              "label": "A  B  C  (in that order, one per line)",
              "correct": true
            },
            {
              "label": "A  C  B  (B is delayed so C runs first)",
              "correct": false
            },
            {
              "label": "The program prints nothing — Task.Delay(0) exits immediately.",
              "correct": false
            },
            {
              "label": "A  B  (C is unreachable after an await)",
              "correct": false
            }
          ],
          "explanation": "`await Task.Delay(0)` creates an already-completed Task. The `await` machinery checks whether the Task is already complete; if it is, the continuation runs synchronously inline rather than being posted to the scheduler. So 'A', 'B', and 'C' all print in order on the same logical flow. Even when `Task.Delay` has a positive duration, 'B' and 'C' still both print — they are just executed in the continuation after the delay. Code after an `await` is NOT unreachable; it is the continuation body that runs when the awaited task completes."
        },
        {
          "id": "async-q10",
          "kind": "mcq",
          "prompt": "What does `ConfigureAwait(false)` do, and where should you use it?",
          "options": [
            {
              "label": "It disables exception propagation so the continuation runs even if the awaited task faulted.",
              "correct": false
            },
            {
              "label": "It tells the awaiter not to resume the continuation on the captured SynchronizationContext. Use it in library/reusable code that does not need the calling context, to avoid deadlocks and unnecessary thread marshalling.",
              "correct": true
            },
            {
              "label": "It makes the continuation run on a new dedicated Thread instead of the ThreadPool.",
              "correct": false
            },
            {
              "label": "It is equivalent to `CancellationToken.None` — it disables cancellation for the awaited task.",
              "correct": false
            }
          ],
          "explanation": "When you `await` a task, the runtime by default captures `SynchronizationContext.Current` and posts the continuation back onto it (e.g., the WinForms UI thread or ASP.NET classic request thread). `ConfigureAwait(false)` says: 'Don't bother — run the continuation on whatever thread is available (usually the ThreadPool).' In library code this is crucial: (1) it avoids deadlocks when a library user calls `.Result` on a context-aware thread, and (2) it skips the overhead of context marshalling. In ASP.NET Core, where `SynchronizationContext.Current` is `null`, it has no behavioral effect but is still written as a defensive habit for cross-environment portability. It does NOT suppress `ExecutionContext` flow — `AsyncLocal<T>` values still propagate."
        }
      ],
      challenges: [
        {
          "id": "async-p3",
          "difficulty": "easy",
          "title": "Write Your First Async Method",
          "prompt": "Build a small console program that simulates fetching a user profile from a slow API.\n\n**Requirements:**\n1. Write an `async Task<string> FetchUserProfileAsync(int userId)` method that:\n   - Prints `\"Fetching profile for user {userId}...\"` to the console.\n   - Awaits `Task.Delay(500)` to simulate network latency.\n   - Returns the string `\"User {userId}: Alice Smith, alice@example.com\"`.\n2. Write an `async Task Main(string[] args)` entry point that:\n   - Calls `FetchUserProfileAsync(7)` with `await`.\n   - Prints the returned profile string.\n   - Prints `\"Done.\"` after.\n3. Below your working code, add a comment block that answers: *What does the `async` keyword on a method actually do by itself? Does it make the method run on a background thread?*\n\n**Expected output:**\n```\nFetching profile for user 7...\nUser 7: Alice Smith, alice@example.com\nDone.\n```",
          "hints": [
            "`async Task Main` has been supported since C# 7.1 — you do not need a synchronous `Main` that calls `.Wait()`.",
            "The `async` keyword alone does NOT spawn a new thread. It only enables `await` inside the method and triggers the compiler's state machine transformation.",
            "`Task.Delay` is the async equivalent of `Thread.Sleep` — it does not block the thread.",
            "If you accidentally write `async void Main`, the program may exit before `FetchUserProfileAsync` completes. Use `async Task Main`."
          ]
        },
        {
          "id": "async-p4",
          "difficulty": "medium",
          "title": "Sequential vs Parallel Awaiting",
          "prompt": "You have three async helper methods that each take approximately 1 second:\n\n```csharp\nstatic async Task<string> GetInventoryAsync() {\n    await Task.Delay(1000);\n    return \"Inventory: 42 units\";\n}\nstatic async Task<string> GetPricingAsync() {\n    await Task.Delay(1000);\n    return \"Price: $19.99\";\n}\nstatic async Task<string> GetReviewsAsync() {\n    await Task.Delay(1000);\n    return \"Reviews: 4.7 stars\";\n}\n```\n\n**Part A — Sequential (broken) version.** Write a method `GetProductDetailsSequentialAsync()` that awaits each method one after the other and concatenates the three results. Measure and print elapsed time with `Stopwatch`. Predict the total time before running.\n\n**Part B — Parallel (correct) version.** Write a method `GetProductDetailsParallelAsync()` that starts all three tasks simultaneously and uses `Task.WhenAll` to await them all. Measure elapsed time. Predict the total time before running.\n\n**Part C — Explain the difference.** In your comment or written answer, explain:\n- Why does Part A take ~3 seconds but Part B takes ~1 second?\n- When would you NOT want to run tasks in parallel (give one concrete example)?\n\n**Tip:** Use `Stopwatch.StartNew()` and `sw.Elapsed.TotalSeconds` for timing.",
          "hints": [
            "In Part A, each `await` suspends the method until that task completes before the next line runs.",
            "In Part B, call all three methods (no `await`) to get three `Task<string>` objects, then pass all three to `Task.WhenAll`. Only then `await` the combined task.",
            "`var results = await Task.WhenAll(t1, t2, t3)` gives you a `string[]` where `results[0]` is from `t1`, `results[1]` from `t2`, etc.",
            "You would NOT run in parallel if the second operation depends on the result of the first — sequential is correct when there is a data dependency."
          ]
        }
      ]
    },
    {
      ...lesson04,
      questions: [
        {
          "id": "async-q4",
          "kind": "mcq",
          "prompt": "You are writing a reusable NuGet library method that fetches data over HTTP. Which signature and body pattern is most correct for .NET 10?",
          "options": [
            {
              "label": "`public string FetchData(string url) { return httpClient.GetStringAsync(url).Result; }`",
              "correct": false
            },
            {
              "label": "`public async void FetchDataAsync(string url) { result = await httpClient.GetStringAsync(url); }`",
              "correct": false
            },
            {
              "label": "`public async Task<string> FetchDataAsync(string url, CancellationToken cancellationToken = default) { return await httpClient.GetStringAsync(url, cancellationToken).ConfigureAwait(false); }`",
              "correct": true
            },
            {
              "label": "`public Task<string> FetchDataAsync(string url) { return Task.Run(() => httpClient.GetStringAsync(url).Result); }`",
              "correct": false
            }
          ],
          "explanation": "The correct pattern for a library method combines four things: (1) `async Task<T>` return type so callers can await the result and observe exceptions, (2) `Async` suffix by convention, (3) a `CancellationToken` parameter with a `default` value so callers can pass a token or omit it, and (4) `.ConfigureAwait(false)` so the continuation does not marshal back to the caller's SynchronizationContext — avoiding potential deadlocks when consumed from UI or ASP.NET classic apps. `async void` makes the exception unobservable. `.Result` risks a deadlock. `Task.Run` wrapping `.Result` wastes a ThreadPool thread."
        },
        {
          "id": "async-q5",
          "kind": "predict",
          "prompt": "The following code runs inside a WinForms button click handler (where `SynchronizationContext.Current` is the Windows Forms context). What happens when the button is clicked?",
          "code": "// Inside a WinForms Form class\nprivate void button1_Click(object sender, EventArgs e)\n{\n    var result = GetMessageAsync().Result; // <-- synchronous block\n    label1.Text = result;\n}\n\nprivate async Task<string> GetMessageAsync()\n{\n    await Task.Delay(500); // captures the UI SynchronizationContext\n    return \"Hello\";\n}\n",
          "options": [
            {
              "label": "The label updates to 'Hello' after a 500 ms pause — everything works fine.",
              "correct": false
            },
            {
              "label": "The application deadlocks: the UI thread blocks on `.Result`, and the continuation from `Task.Delay` needs the UI thread to resume, so it can never proceed.",
              "correct": true
            },
            {
              "label": "An `InvalidOperationException` is thrown because `.Result` is not allowed in UI applications.",
              "correct": false
            },
            {
              "label": "The delay is skipped and the label immediately updates to 'Hello'.",
              "correct": false
            }
          ],
          "explanation": "This is the classic SynchronizationContext deadlock. Step by step: (1) The UI thread calls `.Result`, which blocks the UI thread waiting for the Task to complete. (2) `GetMessageAsync` runs synchronously until `await Task.Delay(500)`. At this `await`, the current `SynchronizationContext` (the WinForms UI context) is captured. (3) After 500 ms, `Task.Delay` completes and the runtime tries to `Post` the continuation back onto the UI thread via the captured SynchronizationContext. (4) But the UI thread is blocked in `.Result` — it cannot process the Post. Deadlock. Fix options: make `button1_Click` `async void` and `await` the method, or add `.ConfigureAwait(false)` inside `GetMessageAsync` so the continuation doesn't need the UI thread."
        },
        {
          "id": "async-q6",
          "kind": "mcq",
          "prompt": "When is `async void` acceptable in C#?",
          "options": [
            {
              "label": "Whenever you want fire-and-forget behavior — it is a supported pattern for background work.",
              "correct": false
            },
            {
              "label": "Only for UI event handlers (WinForms/WPF/MAUI button clicks, etc.) where the delegate signature requires `void`, and even then you must wrap the body in `try/catch`.",
              "correct": true
            },
            {
              "label": "In ASP.NET Core controller actions when the action does not need to return a value.",
              "correct": false
            },
            {
              "label": "In `BackgroundService.ExecuteAsync` overrides to improve performance.",
              "correct": false
            }
          ],
          "explanation": "`async void` has one legitimate use: UI framework event handlers where the framework owns the delegate signature (`EventHandler`, which returns `void`) and cannot be changed. Even there it is dangerous — exceptions thrown inside an `async void` method are re-thrown on the SynchronizationContext and, if unhandled, crash the process. They cannot be caught by the caller because there is no `Task` to observe. In ALL other contexts — ASP.NET Core, background services, libraries, console apps — always return `Task` or `Task<T>`. For fire-and-forget in non-UI code, store the `Task` and attach error handling via `.ContinueWith` or a dedicated wrapper."
        },
        {
          "id": "async-q12",
          "kind": "predict",
          "prompt": "What is the output of this program?",
          "code": "using System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        try\n        {\n            await BrokenAsync();\n        }\n        catch (Exception ex)\n        {\n            Console.WriteLine($\"Caught: {ex.Message}\");\n        }\n    }\n\n    static async void BrokenAsync()\n    {\n        await Task.Delay(10);\n        throw new InvalidOperationException(\"async void boom\");\n    }\n}",
          "options": [
            {
              "label": "Caught: async void boom",
              "correct": false
            },
            {
              "label": "The exception is NOT caught by the try/catch. The program crashes with an unhandled exception.",
              "correct": true
            },
            {
              "label": "The program prints nothing and exits silently.",
              "correct": false
            },
            {
              "label": "A compile error — you cannot await an async void method.",
              "correct": false
            }
          ],
          "explanation": "There are two things to notice here. First, `await BrokenAsync()` does NOT compile if `BrokenAsync` returns `void` — you cannot await a `void` return. But if it compiles (the `await` is silently dropped by the compiler when awaiting something that evaluates to `void`... actually the compiler will flag this), the broader point stands: `async void` exceptions are re-thrown on the `SynchronizationContext` or `ThreadPool`, NOT on the call-site's `try/catch`. The caller has no `Task` to observe, so the `catch` block never sees the exception. In a console app with no SynchronizationContext, this causes an unhandled exception that terminates the process. This is the single biggest danger of `async void` outside of event handlers."
        }
      ],
      challenges: [
        {
          "id": "async-p5",
          "difficulty": "medium",
          "title": "The Four Deadly Async Mistakes",
          "prompt": "Each code snippet below contains exactly one deadly async mistake. For each:\n- Name the anti-pattern.\n- Explain *precisely* what goes wrong at runtime (or why it is dangerous).\n- Write a corrected version.\n\n**Snippet 1 — async void**\n```csharp\npublic async void SendWelcomeEmailAsync(string email)\n{\n    await Task.Delay(200);\n    await _emailService.SendAsync(email, \"Welcome!\");\n    // What if SendAsync throws?\n}\n\n// Caller in a controller:\nawait SendWelcomeEmailAsync(user.Email); // compile error here\n```\n\n**Snippet 2 — .Result on UI thread (WinForms)**\n```csharp\nprivate void RefreshButton_Click(object sender, EventArgs e)\n{\n    var data = LoadDashboardDataAsync().Result; // hangs forever\n    labelData.Text = data;\n}\n\nprivate async Task<string> LoadDashboardDataAsync()\n{\n    await Task.Delay(500);\n    return \"Dashboard loaded\";\n}\n```\n\n**Snippet 3 — fire-and-forget without error handling**\n```csharp\npublic IActionResult StartExport(int reportId)\n{\n    _ = GenerateReportAsync(reportId); // discarded task\n    return Accepted();\n}\n\nprivate async Task GenerateReportAsync(int reportId)\n{\n    await Task.Delay(5000);\n    throw new InvalidOperationException(\"Disk full\");\n}\n```\n\n**Snippet 4 — sync-over-async in a library**\n```csharp\n// Library method used by both Console and ASP.NET classic callers:\npublic string GetConfigValue(string key)\n{\n    return FetchFromRemoteAsync(key).GetAwaiter().GetResult();\n}\n```",
          "hints": [
            "Snippet 1: `async void` cannot be awaited — the compiler error on the caller side is a clue. Exceptions from async void go to the SynchronizationContext, not to any caller's try/catch.",
            "Snippet 2: The UI thread calls `.Result`, blocking itself. The `await Task.Delay(500)` continuation needs to post back to the UI thread to resume — but the UI thread is blocked. Classic deadlock.",
            "Snippet 3: The discarded `Task` carries the exception. When `GenerateReportAsync` throws, the exception has nowhere to go — in .NET, unobserved task exceptions are swallowed (since .NET 4.5). The error is lost silently.",
            "Snippet 4: This is the sync-over-async anti-pattern. Even though ASP.NET Core has no SynchronizationContext and won't deadlock, it wastes a ThreadPool thread for the entire duration of the I/O — under load this tanks throughput. The fix is to make `GetConfigValue` async."
          ]
        }
      ]
    },
    {
      ...lesson05,
      questions: [
        {
          "id": "async-q7",
          "kind": "fill",
          "prompt": "Complete the CancellationToken usage. The `ProcessOrdersAsync` method should automatically cancel itself after 30 seconds.",
          "template": "using var cts = new CancellationTokenSource();\ncts.___( TimeSpan.FromSeconds(30) );\nawait ProcessOrdersAsync(cts.Token);",
          "accept": [
            "CancelAfter"
          ],
          "explanation": "`CancellationTokenSource.CancelAfter(TimeSpan)` schedules automatic cancellation after the specified duration. This is the idiomatic way to implement a timeout without a separate timer. The alternatives are `cts.Cancel()` (immediate, manual) and `CancellationTokenSource.CreateLinkedTokenSource(...)` (combining multiple signals). After calling `CancelAfter`, the token will transition to cancelled state after 30 seconds, and any method checking `cancellationToken.ThrowIfCancellationRequested()` or passing the token to a built-in API like `Task.Delay(ms, ct)` or `ToListAsync(ct)` will receive an `OperationCanceledException`."
        },
        {
          "id": "async-q11",
          "kind": "fill",
          "prompt": "Fill in the blank so that `GetUserAsync` passes cancellation support correctly through to the database query.",
          "template": "public async Task<User?> GetUserAsync(int id, CancellationToken cancellationToken = default)\n{\n    return await _db.Users\n        .Where(u => u.Id == id)\n        .FirstOrDefaultAsync( ___ );\n}",
          "accept": [
            "cancellationToken",
            "ct",
            "cancellationToken: cancellationToken"
          ],
          "explanation": "EF Core's async methods (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`, etc.) all accept an optional `CancellationToken`. Passing `cancellationToken` here means the database query will be cancelled if the token fires — for example, when an HTTP client disconnects and ASP.NET Core cancels `HttpContext.RequestAborted`. Without it, the query runs to completion even after the client is gone, wasting database resources. This is the 'always pass the token all the way down' principle — every layer must forward the same token to every async call for cancellation to actually work end-to-end."
        },
        {
          "id": "async-q14",
          "kind": "mcq",
          "prompt": "In an ASP.NET Core minimal API, which of the following correctly uses `CancellationToken` to cancel database work when the client disconnects?",
          "options": [
            {
              "label": "`app.MapGet(\"/orders\", async () => { using var cts = new CancellationTokenSource(); return await db.Orders.ToListAsync(cts.Token); });`",
              "correct": false
            },
            {
              "label": "`app.MapGet(\"/orders\", async (CancellationToken ct) => { return await db.Orders.ToListAsync(ct); });`",
              "correct": true
            },
            {
              "label": "`app.MapGet(\"/orders\", () => { return db.Orders.ToList(); });`",
              "correct": false
            },
            {
              "label": "`app.MapGet(\"/orders\", async () => { await Task.Delay(0); return db.Orders.ToList(); });`",
              "correct": false
            }
          ],
          "explanation": "ASP.NET Core automatically binds `HttpContext.RequestAborted` to a `CancellationToken` parameter declared in a minimal API handler or controller action. When the client disconnects (browser navigation, timeout, network drop), the framework cancels that token. By passing `ct` to `ToListAsync(ct)`, EF Core will abandon the database query immediately on cancellation, freeing the database connection and the ThreadPool thread. Creating a `new CancellationTokenSource()` inside the handler creates an unconnected token that never gets cancelled by the framework — it defeats the purpose. The synchronous `.ToList()` options block a thread and ignore disconnects entirely."
        }
      ],
      challenges: [
        {
          "id": "async-p6",
          "difficulty": "medium",
          "title": "CancellationToken in the Call Chain",
          "prompt": "You are building a product search feature. Implement the following three-layer async stack and wire CancellationToken through every layer.\n\n**Layer 1 — Minimal API endpoint:**\n```csharp\napp.MapGet(\"/search\", async (string query, CancellationToken ct) =>\n{\n    // call the service layer\n});\n```\n\n**Layer 2 — Service method:**\n```csharp\npublic async Task<List<Product>> SearchProductsAsync(\n    string query,\n    CancellationToken cancellationToken = default)\n{\n    // 1. validate: if query is null/empty throw ArgumentException\n    // 2. call the repository layer\n    // 3. return results\n}\n```\n\n**Layer 3 — Repository (simulate with Task.Delay):**\n```csharp\npublic async Task<List<Product>> QueryDatabaseAsync(\n    string query,\n    CancellationToken cancellationToken = default)\n{\n    // simulate 2-second DB query\n    await Task.Delay(2000, cancellationToken);\n    return new List<Product> { new(1, query + \" Widget\"), new(2, query + \" Gadget\") };\n}\n```\n\n**Tasks:**\n1. Fill in all three layers with correct async code, passing `cancellationToken` through every call.\n2. In `Main` (or a test), simulate a client that cancels after 500 ms using `CancellationTokenSource.CancelAfter(500)`. Show the `OperationCanceledException` being caught and a `\"Search cancelled\"` message printed.\n3. Show a second run where the token is NOT cancelled (`CancellationToken.None`) and the full result prints.\n4. Explain: why does `Task.Delay(2000, cancellationToken)` throw `OperationCanceledException` when the token fires, while `Task.Delay(2000)` (no token) would just keep running even after cancel?",
          "hints": [
            "Pass `cancellationToken` (not `CancellationToken.None`) to every async call in every layer.",
            "`CancellationTokenSource.CancelAfter(TimeSpan.FromMilliseconds(500))` schedules cancellation without blocking.",
            "Wrap the search call in `try { } catch (OperationCanceledException) { }` to handle cancellation gracefully.",
            "`Task.Delay` with no token has no awareness of the token at all — it simply runs the timer to completion regardless of what happens outside it."
          ]
        }
      ]
    },
    {
      ...lesson06,
      questions: [
        {
          "id": "async-q9",
          "kind": "mcq",
          "prompt": "You use `Task.WhenAll` to fetch three URLs. The second URL returns a 500 error and your code throws an `HttpRequestException`. What happens to the other two requests, and what exception do you see when you `await` the `WhenAll` task?",
          "options": [
            {
              "label": "The other two requests are cancelled immediately when the second one fails. You see an `AggregateException` containing all three exceptions.",
              "correct": false
            },
            {
              "label": "`Task.WhenAll` waits for ALL three tasks to finish (success or failure). When you `await` the result, only the FIRST exception is thrown. All exceptions are accessible via `task.Exception.InnerExceptions`.",
              "correct": true
            },
            {
              "label": "`Task.WhenAll` short-circuits immediately when any task faults and throws an `AggregateException` wrapping only that one exception.",
              "correct": false
            },
            {
              "label": "The exception is silently swallowed and the other two results are returned normally.",
              "correct": false
            }
          ],
          "explanation": "`Task.WhenAll` always waits for every task in the list to reach a terminal state — success, faulted, or cancelled — before itself completing. It never cancels the remaining tasks automatically. When you `await` the resulting task, C# unwraps the `AggregateException` and re-throws only the first inner exception. To inspect ALL failures (important for logging in production), capture the task before awaiting it and check `task.Exception.InnerExceptions`, or wrap individual tasks in `try/catch` before passing them to `WhenAll`. In a microservice aggregator, you typically want to know about every failed downstream call, not just the first one."
        },
        {
          "id": "async-q13",
          "kind": "mcq",
          "prompt": "You need to fetch results from 5 different microservice endpoints and combine them into a single API response. Which approach gives the best throughput?",
          "options": [
            {
              "label": "Use a `for` loop that `await`s each `HttpClient` call in turn: `foreach (var url in urls) { results.Add(await http.GetStringAsync(url)); }`",
              "correct": false
            },
            {
              "label": "Start all 5 tasks without awaiting them, then call `await Task.WhenAll(tasks)` to wait for all to complete in parallel.",
              "correct": true
            },
            {
              "label": "Use `Task.WhenAny` to get the first response and discard the rest.",
              "correct": false
            },
            {
              "label": "Use `Parallel.ForEach` with a synchronous `HttpClient.GetString` call inside each iteration.",
              "correct": false
            }
          ],
          "explanation": "The correct pattern is to START all tasks first (no `await` yet), then collect them with `Task.WhenAll`: `var tasks = urls.Select(url => http.GetStringAsync(url)).ToList(); var results = await Task.WhenAll(tasks);`. This launches all 5 HTTP requests simultaneously — total time is roughly equal to the slowest single request rather than the sum of all five. The `for`/`foreach`-with-`await` pattern serializes the requests (poor). `Task.WhenAny` discards 4 of the 5 results (wrong goal). `Parallel.ForEach` with synchronous calls blocks 5 ThreadPool threads the entire time — wasteful and does not compose with async properly."
        }
      ],
      challenges: [
        {
          "id": "async-p7",
          "difficulty": "medium",
          "title": "Handling Errors from Task.WhenAll",
          "prompt": "You are building a health-check aggregator. It pings three downstream services and must report the status of ALL of them — including which ones failed — rather than stopping at the first error.\n\n**Given these stubs:**\n```csharp\nstatic async Task<string> CheckServiceAAsync()\n{\n    await Task.Delay(200);\n    return \"ServiceA: OK\";\n}\nstatic async Task<string> CheckServiceBAsync()\n{\n    await Task.Delay(300);\n    throw new HttpRequestException(\"ServiceB: Connection refused\");\n}\nstatic async Task<string> CheckServiceCAsync()\n{\n    await Task.Delay(150);\n    throw new TimeoutException(\"ServiceC: Timed out\");\n}\n```\n\n**Tasks:**\n1. Use `Task.WhenAll` to run all three checks in parallel and collect results.\n2. If you just `await Task.WhenAll(a, b, c)` and two tasks fault, which exception do you see? Write code that demonstrates this by catching the exception and printing its type and message.\n3. Show how to inspect **all** exceptions, not just the first. Print each failed service's error message.\n4. Show an alternative pattern where you wrap each individual task in a try/catch *before* passing to `WhenAll`, so you get a mixed result list with both successes and failure messages instead of an exception.\n5. Which pattern (2/3 vs 4) is more appropriate for a health-check dashboard that must always display the status of every service? Justify your answer.",
          "hints": [
            "When you `await Task.WhenAll(taskA, taskB, taskC)`, the returned `Task` itself holds an `AggregateException` in its `.Exception` property. Awaiting it unwraps and throws only the first inner exception.",
            "To see all exceptions: store the `Task` returned by `WhenAll` in a variable, await it inside a try/catch, then inspect `whenAllTask.Exception!.InnerExceptions`.",
            "For the mixed-result pattern (approach 4), consider returning a `(string ServiceName, string? Result, string? Error)` tuple from each wrapper.",
            "Pattern 4 is generally better for health-checks because you always get a complete picture, even if some services are down."
          ]
        },
        {
          "id": "async-p8",
          "difficulty": "hard",
          "title": "Async Streams with IAsyncEnumerable",
          "prompt": "You are building a log-analysis tool that reads a large log file line by line and streams matching lines to the caller without loading the entire file into memory.\n\n**Part A — Implement the async stream producer:**\nWrite a method:\n```csharp\npublic static async IAsyncEnumerable<string> ReadMatchingLinesAsync(\n    string filePath,\n    string searchTerm,\n    [EnumeratorCancellation] CancellationToken cancellationToken = default)\n```\nThe method should:\n- Open the file with `File.OpenText(filePath)` (or `StreamReader`).\n- Read lines one at a time with `ReadLineAsync(cancellationToken)` (available in .NET 7+; fallback: `ReadLineAsync()` and check `cancellationToken.ThrowIfCancellationRequested()`).\n- `yield return` only lines that contain `searchTerm` (case-insensitive).\n- Dispose the reader properly.\n\n**Part B — Implement the consumer:**\nWrite an `async Task Main` that:\n- Creates a test file with at least 10 lines, some containing \"ERROR\" and some not.\n- Calls `ReadMatchingLinesAsync` with `WithCancellation(ct)` and `ConfigureAwait(false)`.\n- Prints each matching line with its line number (track with a counter).\n- Cancels after finding 3 matches (use `CancellationTokenSource.Cancel()` after the third match).\n\n**Part C — Explain:**\n- Why is `[EnumeratorCancellation]` necessary? What happens without it if you use `.WithCancellation(ct)` at the consumer site?\n- How does `IAsyncEnumerable<T>` differ from returning a `Task<List<T>>`? Give one real-world scenario where the streaming approach is clearly superior.",
          "hints": [
            "`[EnumeratorCancellation]` (in `System.Runtime.CompilerServices`) causes the compiler to wire the token passed via `.WithCancellation(ct)` into the method parameter automatically.",
            "Use `using var reader = File.OpenText(filePath)` — the `using` in an async iterator works correctly and disposes when the iteration ends or is cancelled.",
            "Catch `OperationCanceledException` in Main gracefully — it is expected and normal when you cancel after 3 matches.",
            "A `Task<List<T>>` buffers ALL results before returning. `IAsyncEnumerable<T>` starts delivering results immediately and uses constant memory — crucial for files that are gigabytes large."
          ]
        },
        {
          "id": "async-p9",
          "difficulty": "hard",
          "title": "Timeout, Race, and Graceful Cancellation with Task.WhenAny",
          "prompt": "You are calling a third-party payment processor API that does not support `CancellationToken`. You need to enforce a 3-second timeout and cancel your own internal work if the payment takes too long.\n\n**Part A — Implement the timeout wrapper:**\n```csharp\npublic static async Task<T> WithTimeoutAsync<T>(\n    Task<T> operation,\n    TimeSpan timeout,\n    string operationName,\n    CancellationTokenSource? internalCts = null)\n```\n- Use `Task.WhenAny` to race `operation` against `Task.Delay(timeout)`.\n- If the delay wins: call `internalCts?.Cancel()`, and throw a `TimeoutException` with a descriptive message.\n- If the operation wins: **re-await the operation** (don't just return `task.Result`) to correctly propagate any exception the operation may have thrown.\n\n**Part B — Demonstrate it with a simulated payment service:**\n```csharp\nstatic async Task<string> CallPaymentProcessorAsync(decimal amount)\n{\n    await Task.Delay(5000); // always takes 5 seconds — too slow\n    return $\"Paid ${amount}\";\n}\n```\nShow:\n1. A call where the timeout fires (3s timeout, 5s operation) — print the `TimeoutException` message.\n2. A call where the operation succeeds (3s timeout, 1s operation — change the delay) — print the result.\n3. A call where the operation throws its own exception (e.g., throw `new HttpRequestException(\"Declined\")`) before the timeout — show that the `HttpRequestException` propagates correctly, not a timeout.\n\n**Part C — Explain:**\n- Why must you re-await the winning task from `WhenAny` instead of reading `.Result`?\n- What resource leak happens if you call `WithTimeoutAsync` 1,000 times rapidly without using a `CancellationToken` inside `Task.Delay`? How would you fix it?\n- In production, why would you prefer `CancellationTokenSource.CancelAfter(timeout)` over the `WhenAny` pattern for operations that DO support `CancellationToken`?",
          "hints": [
            "`Task.WhenAny` returns `Task<Task<T>>` — the outer task completes when the first inner task completes. `await Task.WhenAny(...)` gives you the winning `Task<T>`.",
            "Compare the winning task reference with `delayTask` using `==` to determine whether it was the timeout or the real operation that won.",
            "Re-awaiting the winning operation task (e.g., `await operationTask`) is essential: if the task faulted, re-awaiting it throws the stored exception. Reading `.Result` also throws but wraps it in `AggregateException`.",
            "Without a `CancellationToken` in `Task.Delay(timeout)`, each call that times out leaves a live `Task.Delay` timer running on the ThreadPool until it naturally expires. Fix: pass a `CancellationToken` to `Task.Delay` and cancel it when the operation wins."
          ]
        },
        {
          "id": "async-p10",
          "difficulty": "hard",
          "title": "Mini-Project — Parallel URL Fetcher",
          "prompt": "Build a complete, production-quality console tool that fetches multiple URLs concurrently, reports timing, respects a cancellation timeout, and handles individual failures gracefully.\n\n**Requirements:**\n\n1. **Input:** Accept a hard-coded list of at least 5 URLs (mix real and intentionally invalid ones, e.g., `\"https://httpbin.org/delay/2\"`, `\"https://httpbin.org/status/500\"`, `\"https://nonexistent.invalid\"`, `\"https://httpbin.org/get\"`, `\"https://httpbin.org/delay/4\"`).\n\n2. **Fetcher method:**\n```csharp\nstatic async Task<FetchResult> FetchUrlAsync(\n    HttpClient client,\n    string url,\n    CancellationToken cancellationToken)\n```\nReturn a `record FetchResult(string Url, bool Success, int? StatusCode, string? ErrorMessage, TimeSpan Elapsed)`.\n- Use `Stopwatch` per URL for individual timing.\n- Catch `HttpRequestException`, `TaskCanceledException`, and any other exception — store the error message, set `Success = false`.\n- On `TaskCanceledException`, set `ErrorMessage` to `\"Timed out or cancelled\"`.\n\n3. **Orchestrator:**\n- Create a SINGLE `HttpClient` instance (not one per URL).\n- Set an overall timeout via `CancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(5))` — any URL not done in 5 seconds is cancelled.\n- Start all URL fetch tasks WITHOUT awaiting each one (fan-out).\n- Use `Task.WhenAll` to await all tasks.\n- Do NOT let one task's exception prevent others from completing.\n\n4. **Output table:** After all tasks complete, print a formatted summary table:\n```\nURL                                     Status   Code  Time\n------------------------------------------------------------\nhttps://httpbin.org/get                 OK       200   0.31s\nhttps://httpbin.org/status/500          FAIL     500   0.28s\nhttps://nonexistent.invalid             ERROR    -     0.12s  Connection refused\nhttps://httpbin.org/delay/2             OK       200   2.14s\nhttps://httpbin.org/delay/4             TIMEOUT  -     5.01s  Timed out or cancelled\n------------------------------------------------------------\nTotal: 5 URLs | 2 succeeded | 3 failed | Wall time: 5.04s\n```\n\n5. **Code quality requirements:**\n- Use `async Task Main`.\n- Dispose `HttpClient` and `CancellationTokenSource` properly (using/await using).\n- Use `Task.WhenAll` with per-task exception isolation (wrap each `FetchUrlAsync` so it never itself throws — it always returns a `FetchResult`).\n- Use C# 14 primary constructors for the `FetchResult` record if applicable.\n- No `.Result`, no `.Wait()`, no `async void`.\n\n6. **Reflection questions (answer in code comments):**\n- Why is it important to create only ONE `HttpClient` rather than one per request?\n- If 4 of the 5 URLs succeed but 1 throws inside `FetchUrlAsync`, and you did NOT wrap with try/catch inside `FetchUrlAsync`, what would `Task.WhenAll` do? How would you still get the 4 successful results?\n- How would you extend this tool to process 500 URLs without overwhelming the target servers (hint: `SemaphoreSlim`)?",
          "hints": [
            "Create `HttpClient` once and reuse it — each instantiation does NOT get its own connection pool, and rapid create/dispose causes socket exhaustion (TIME_WAIT).",
            "Wrap the entire body of `FetchUrlAsync` in try/catch so it always returns a `FetchResult` rather than faulting the task — this is the key to per-task exception isolation with `WhenAll`.",
            "A `Stopwatch` per URL: start it before the `HttpClient` call, stop it in the `finally` block or after the call (inside the catch too).",
            "For 500 URLs with rate limiting: `SemaphoreSlim sem = new(maxConcurrent, maxConcurrent)` — each task calls `await sem.WaitAsync(ct)` before fetching and `sem.Release()` in a finally block.",
            "`TaskCanceledException` is thrown by `HttpClient` when the `CancellationToken` fires. Check `ex.CancellationToken.IsCancellationRequested` to distinguish a user cancel from an internal `HttpClient` timeout."
          ]
        }
      ]
    }
  ],
  projects: [
  {
    "id": "async-proj-1",
    "difficulty": "starter",
    "title": "Async File Report Generator",
    "brief": "Build a console app that reads multiple log files concurrently using async file I/O, then writes a summary report — demonstrating why async matters for I/O-bound work and how Task and Task<T> model units of async work.",
    "requirements": [
      "Accept a list of file paths as command-line arguments (or hard-code 4-5 sample log files for demo purposes).",
      "Read each file asynchronously using `File.ReadAllTextAsync(path)` returning `Task<string>`.",
      "Start all file reads simultaneously — do NOT await each one before starting the next.",
      "Collect all results with `await Task.WhenAll(...)` and store the returned `string[]`.",
      "For each file, count the number of lines containing the word `ERROR` (case-insensitive).",
      "Write a summary report asynchronously to `report.txt` using `File.WriteAllTextAsync` returning `Task`.",
      "Print how long the entire operation took using `Stopwatch`.",
      "Use `async Task Main` as the entry point — never call `.Wait()` or `.Result`."
    ],
    "stretch": [
      "Add a `CancellationTokenSource` with a 5-second timeout; pass the token to every `ReadAllTextAsync` call and gracefully report which files were not processed if the timeout fires.",
      "Implement the file reading as a method returning `Task<(string path, int errorCount)>` and display a per-file table in the report.",
      "Replace the fixed file list with a directory glob (e.g., `*.log`) so the number of files is dynamic.",
      "Use `IAsyncEnumerable<string>` to stream each file line-by-line instead of reading the whole file at once, keeping memory usage flat for very large files."
    ],
    "concepts": [
      "Task<T>",
      "async Task Main",
      "Task.WhenAll",
      "parallel I/O fan-out",
      "File async APIs",
      "Stopwatch timing",
      "avoiding sequential await loops"
    ]
  },
  {
    "id": "async-proj-2",
    "difficulty": "intermediate",
    "title": "Resilient Parallel URL Health Checker",
    "brief": "Build a console tool that probes a list of URLs concurrently with HttpClient, enforces a per-request timeout via CancellationToken, handles individual failures without crashing the batch, and streams live status updates to the console as each check completes.",
    "requirements": [
      "Accept a hard-coded or file-sourced list of at least 6 URLs (mix of valid, slow, and unreachable hosts to exercise all code paths).",
      "Create a single shared `HttpClient` instance (do not instantiate one per request).",
      "Write an async method `CheckUrlAsync(string url, CancellationToken ct) -> Task<HealthResult>` where `HealthResult` is a record holding the URL, HTTP status code (or error message), and elapsed milliseconds.",
      "Inside `CheckUrlAsync`, use `CancellationTokenSource.CreateLinkedTokenSource` to combine the incoming token with a fresh per-request 3-second timeout, so each URL gets its own timeout independent of the others.",
      "Start all `CheckUrlAsync` tasks before awaiting any of them — do not use a sequential `foreach` with `await` inside.",
      "Use `Task.WhenEach` (available in .NET 9+ / .NET 10) to print each `HealthResult` to the console as it arrives, in completion order rather than input order.",
      "After all tasks complete, print a final summary table: total URLs checked, how many returned 2xx, how many timed out, how many errored, and total wall-clock time.",
      "Accept a top-level `CancellationToken` from `Console.CancelKeyPress` (Ctrl+C) so the user can abort the entire batch early and see partial results."
    ],
    "stretch": [
      "Implement retry logic with exponential back-off (up to 2 retries) for any request that fails with a network error (not a timeout), using a helper `async Task<T> RetryAsync(Func<Task<T>> operation, int maxAttempts, CancellationToken ct)`.",
      "Write results to a CSV file asynchronously as each `HealthResult` arrives, using a `Channel<HealthResult>` producer/consumer pattern so the writer never blocks the HTTP tasks.",
      "Add a `--concurrency <n>` flag that limits how many URLs are probed simultaneously using `SemaphoreSlim`, then benchmark the tool at concurrency 1, 3, and unlimited to illustrate throughput vs. resource control.",
      "Replace the URL list with an `IAsyncEnumerable<string>` source that pages through a remote JSON feed, demonstrating async streaming input feeding into the parallel checker."
    ],
    "concepts": [
      "HttpClient",
      "CancellationToken",
      "CancellationTokenSource.CreateLinkedTokenSource",
      "per-request timeouts",
      "Task.WhenAll",
      "Task.WhenEach",
      "IAsyncEnumerable",
      "parallel fan-out without sequential await",
      "Console.CancelKeyPress",
      "OperationCanceledException handling",
      "record types",
      "async Task Main"
    ]
  }
],
};
