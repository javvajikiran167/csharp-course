import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "async-await",
  "number": 3,
  "title": "async / await Syntax",
  "objective": "Write async methods with the async and await keywords, understand what the compiler generates, and know when to mark a method async.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Two keywords — `async` and `await` — unlock the entire world of non-blocking C# code. By the end of this lesson you will be able to write async methods from scratch, read what the C# compiler secretly generates behind the scenes, and make confident decisions about when (and when not) to reach for `async`."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students come from Python asyncio, so lean on that analogy early — the mental model transfers well once you clarify that C# Task is NOT a coroutine object.",
        "The state-machine section is the hardest for beginners. Use the 'sticky note' analogy: the compiler turns local variables into sticky notes on a clipboard so the method can pick up exactly where it left off.",
        "Live-code the DownloadPageAsync example first, then show what happens if you remove 'async' or remove 'await' — the compiler errors make the keyword roles concrete.",
        "Emphasize the 'async all the way' principle before touching the pitfalls section — most early mistakes stem from mixing sync and async.",
        "The ConfigureAwait(false) rule is library code only; reassure students that in an ASP.NET Core app they rarely need to type it.",
        "When presenting the state machine illustration, stress that the awaiter MUST be a field (not a local variable) so it survives between separate calls to MoveNext(). This is a key insight into why the compiler-generated struct hoists things to fields."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Two Keywords and What They Each Do",
      "id": "two-keywords"
    },
    {
      "kind": "paragraph",
      "text": "In Python you write `async def` to declare a coroutine and `await` to suspend it. C# splits that responsibility across two keywords with very different jobs. Understanding each one separately is the key to writing async code confidently."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "async — the compiler signal",
          "items": [
            "Goes on the method signature: `public async Task<string> FetchAsync()`",
            "Tells the **compiler** to transform the method body into a state machine",
            "Enables the `await` keyword inside that method body",
            "Does **not** by itself make the method run asynchronously or on a background thread",
            "Without `async`, writing `await` inside a method is a compile error"
          ]
        },
        {
          "title": "await — the suspension point",
          "items": [
            "Placed in front of any expression that returns a `Task`, `Task<T>`, or `ValueTask<T>`",
            "Tells the runtime: 'pause this method here, return control to the caller, and resume when the Task finishes'",
            "The calling thread is **not blocked** — it is free to do other work",
            "The result of `await someTask` is the unwrapped value (`T`) when `someTask` is a `Task<T>`",
            "Can only appear inside an `async` method"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Your First async Method",
      "id": "first-async-method"
    },
    {
      "kind": "paragraph",
      "text": "Let's start with the most common real-world shape: fetching a web page. We will build it up step by step so every token earns its place."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "PageFetcher.cs",
      "code": "using System.Net.Http;\nusing System.Threading;\nusing System.Threading.Tasks;\n\npublic static class PageFetcher\n{\n    // 'async' turns this method into a state machine.\n    // 'Task<string>' is the return type — a future string result.\n    public static async Task<string> DownloadPageAsync(\n        string url,\n        CancellationToken cancellationToken = default)\n    {\n        // HttpClient should be reused — injected or static in real apps.\n        using var client = new HttpClient();\n\n        // 'await' suspends HERE. The caller gets the Task back immediately.\n        // This thread is freed to serve other requests while the network I/O runs.\n        string html = await client.GetStringAsync(url, cancellationToken);\n\n        // We resume here after the HTTP response arrives — on a ThreadPool thread.\n        return html.Length > 500 ? html[..500] + \"...\" : html;\n    }\n}\n"
    },
    {
      "kind": "paragraph",
      "text": "Notice the naming convention: async methods that return `Task` or `Task<T>` end with the suffix `Async`. This is a strong .NET convention — it signals to callers that the method should be awaited. Follow it consistently and your teammates will thank you."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Calling an async Method — async All the Way",
      "id": "calling-async"
    },
    {
      "kind": "paragraph",
      "text": "Once you introduce `async` at one layer, the `await` keyword propagates upward through your call stack like a wave. The caller of an async method should itself be `async` and `await` the result. This is the **async all the way** principle — and it is the most important rule in this entire module."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// C# 7.1+ supports 'async Task Main' — always use this in console apps.\nusing System;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main(string[] args)\n    {\n        Console.WriteLine(\"Fetching page...\");\n\n        // Await propagates upward — Main is async so we can await here.\n        string content = await PageFetcher.DownloadPageAsync(\"https://example.com\");\n\n        Console.WriteLine($\"Got {content.Length} characters.\");\n        Console.WriteLine(\"Done.\");\n    }\n}\n"
    },
    {
      "kind": "output",
      "output": "Fetching page...\nGot 503 characters.\nDone.",
      "label": "Console output — example.com returns >500 chars, so the method returns the first 500 chars plus \"...\" (503 total). Exact count varies if the page content changes."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Always use async Task Main in console apps",
      "text": "Since C# 7.1, `static async Task Main()` is natively supported. Use it instead of calling `.GetAwaiter().GetResult()` or `.Wait()` on the top-level task. It keeps the entire program truly async and avoids the classic deadlock trap introduced in the next section."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What the Compiler Generates: The State Machine",
      "id": "state-machine"
    },
    {
      "kind": "paragraph",
      "text": "When Roslyn (the C# compiler) sees `async`, it rewrites your method into a **state machine** — a generated struct that implements `IAsyncStateMachine`. You never write this code yourself, but understanding it demystifies why async behaves the way it does."
    },
    {
      "kind": "paragraph",
      "text": "Here is the conceptual model. Imagine your async method split at every `await` point into numbered **states**. The compiler creates a struct that remembers which state you are in, stores all the local variables **as fields** (so they survive the suspension), and has a `MoveNext()` method that drives execution forward one state at a time."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ConceptualStateMachine.cs",
      "code": "// This is a CONCEPTUAL illustration — not what Roslyn generates verbatim.\n// It shows the logic that 'async/await' expands to under the hood.\n\nusing System.Net.Http;\nusing System.Runtime.CompilerServices;\nusing System.Threading.Tasks;\n\nstruct DownloadPageAsync_StateMachine : IAsyncStateMachine\n{\n    public int _state;           // which await point are we at?\n    public string _url;          // hoisted local variable\n    public HttpClient _client;   // hoisted local variable\n    public string _html;         // hoisted local variable\n    public TaskCompletionSource<string> _tcs; // backs the Task<string> we returned\n\n    // The awaiter MUST be a field, not a local variable.\n    // MoveNext() is called twice — once to start, once to resume —\n    // so the awaiter must survive across those separate calls.\n    private TaskAwaiter<string> _awaiter;\n\n    public void MoveNext()\n    {\n        switch (_state)\n        {\n            case 0: // *** STATE 0: code before the first await ***\n                _client = new HttpClient();\n                _awaiter = _client.GetStringAsync(_url).GetAwaiter();\n\n                if (!_awaiter.IsCompleted)\n                {\n                    _state = 1; // remember to resume at state 1\n                    _awaiter.OnCompleted(MoveNext); // register callback\n                    return;     // *** RETURN TO CALLER — thread is now free ***\n                }\n                goto case 1; // completed synchronously — skip the suspension\n\n            case 1: // *** STATE 1: resuming after the first await ***\n                _html = _awaiter.GetResult(); // unwrap the string\n                string result = _html.Length > 500 ? _html[..500] + \"...\" : _html;\n                _tcs.SetResult(result); // signal the Task<string> as complete\n                break;\n        }\n    }\n\n    public void SetStateMachine(IAsyncStateMachine stateMachine) { }\n}\n"
    },
    {
      "kind": "list",
      "items": [
        "**Before the first `await`**: code runs synchronously on the calling thread.",
        "**At the `await` point**: if the Task is not yet complete, the state machine saves the awaiter to a **field**, registers `MoveNext` as a callback, and **returns to the caller**. The calling thread is immediately freed.",
        "**On completion**: the I/O subsystem (or ThreadPool) calls `MoveNext` again, jumping to the correct state label.",
        "**Local variables** between `await` points are promoted to **fields** on the state machine struct so they survive the suspension — this is why your locals are 'still there' when you resume.",
        "In .NET 10, the state machine is a **struct** in optimized (Release) builds, avoiding a heap allocation for the machine itself."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python analogy: lowering coroutines to state machines",
      "text": "Python does something strikingly similar. When you run `dis.dis()` on an `async def` function, you see `SEND` and `RESUME` opcodes — Python builds a frame object at runtime that records which `yield` point to resume at. C# does the same thing at **compile time** into a strongly-typed struct. Same idea, different phase."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When to Mark a Method async",
      "id": "when-async"
    },
    {
      "kind": "paragraph",
      "text": "Not every method needs `async`. The rule is simple: **mark a method `async` only if its body contains at least one `await` expression**. If you are just passing a `Task` through without inspecting or transforming it, skip `async` and return the `Task` directly — this avoids creating an unnecessary state machine."
    },
    {
      "kind": "examples",
      "intro": "Three common shapes and whether each needs `async`:",
      "examples": [
        {
          "label": "Needs async — body awaits a Task",
          "code": "// The body awaits GetStringAsync AND does further work with the result.\n// async is required here.\npublic async Task<int> CountCharactersAsync(string url)\n{\n    string html = await httpClient.GetStringAsync(url);\n    return html.Length; // work after the await — must be inside async method\n}"
        },
        {
          "label": "Does NOT need async — just forwarding the Task",
          "code": "// No await, no post-await work — just pass the Task through.\n// Adding 'async' here generates a pointless state machine.\npublic Task<string> FetchAsync(string url)\n    => httpClient.GetStringAsync(url); // direct return, no async keyword needed"
        },
        {
          "label": "Does NOT need async — returning a completed Task",
          "code": "// Synchronous implementation satisfying an async interface.\n// Task.FromResult wraps a value in an already-completed Task<T>.\npublic Task<int> GetCachedCountAsync()\n    => Task.FromResult(_cache.Count); // no I/O, no await, no state machine"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The deadlock trap: never block on async with .Result or .Wait()",
      "text": "In environments that have a `SynchronizationContext` — WinForms, WPF, or classic ASP.NET — calling `.Result` or `.Wait()` on an async method **deadlocks**. Here is why: (1) you call `.Result` on the UI thread, blocking it. (2) The async method runs and hits an `await`, capturing the UI `SynchronizationContext` as the resume target. (3) When the I/O finishes, the continuation tries to `Post()` back to the UI thread to resume. (4) The UI thread is blocked waiting for `.Result`. Neither side can proceed. Fix: **go async all the way** up the call stack. If you absolutely must bridge sync-to-async at a single outermost boundary, use `ConfigureAwait(false)` on every `await` inside the called method to strip the context dependency. ASP.NET Core has no `SynchronizationContext` so `.Result` won't deadlock there — but it still wastes a ThreadPool thread, harming throughput under load."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "ConfigureAwait and Where Continuations Run",
      "id": "configure-await"
    },
    {
      "kind": "paragraph",
      "text": "After an `await`, the resumed code runs on a thread determined by the `SynchronizationContext` that was active when the `await` was hit. In a WPF button handler, that means back on the UI thread — essential for touching UI controls. In ASP.NET Core or a console app, there is **no** `SynchronizationContext`, so the continuation runs on whichever ThreadPool thread the I/O completed on."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "LibraryHelper.cs",
      "code": "// In library / reusable code:\n// ConfigureAwait(false) says \"do not try to marshal the continuation\n// back to the caller's SynchronizationContext\".\n// This avoids deadlocks and unnecessary context-switch overhead.\npublic static async Task<byte[]> ReadFileAsync(string path, CancellationToken ct = default)\n{\n    using var stream = File.OpenRead(path);\n    var buffer = new byte[stream.Length];\n    await stream.ReadExactlyAsync(buffer, ct).ConfigureAwait(false);\n    return buffer;\n}\n\n// In application/UI code:\n// Omit ConfigureAwait (defaults to true) so you resume on the UI thread\n// and can safely update controls.\nprivate async void LoadButton_Click(object sender, EventArgs e)\n{\n    try\n    {\n        byte[] data = await ReadFileAsync(\"data.bin\"); // resumes on UI thread\n        myLabel.Text = $\"Loaded {data.Length} bytes\";  // safe — on UI thread\n    }\n    catch (Exception ex)\n    {\n        MessageBox.Show(ex.Message);\n    }\n}\n"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "ConfigureAwait(false) rule of thumb",
      "text": "Write `ConfigureAwait(false)` in **library and NuGet package code** that has no dependency on the calling context. Omit it (keep the default `true`) in **UI event handlers** that touch controls after an await. In **ASP.NET Core application code**, `ConfigureAwait(false)` has no behavioral effect (no context to capture) but is still harmless — many teams write it for cross-platform library habit."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`async` is a **compiler signal** that enables `await` inside a method and transforms the body into a state machine. It does not by itself spawn a new thread.",
        "`await` is the **suspension point** — it returns control to the caller immediately, freeing the thread, and schedules a continuation to resume after the awaited `Task` completes.",
        "The compiler rewrites every `async` method into a struct-based **state machine** that hoists local variables — including the awaiter itself — into fields so they survive each suspension point.",
        "Mark a method `async` only when its body contains an `await`. If you are only forwarding a `Task`, return it directly — skipping `async` avoids an unnecessary state machine allocation.",
        "Follow the **async all the way** principle: once you start awaiting, propagate `async Task` up the entire call stack. Mix it with `.Result` or `.Wait()` at your peril — especially in UI and classic ASP.NET environments where it causes deadlocks.",
        "`ConfigureAwait(false)` in library code prevents continuations from marshalling back to the caller's `SynchronizationContext`, avoiding deadlocks and context-switch overhead.",
        "Always use `static async Task Main()` in console apps — it is natively supported since C# 7.1 and keeps the entire program asynchronous from the top."
      ]
    }
  ]
};
