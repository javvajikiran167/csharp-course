import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  "slug": "mini-project-async",
  "number": 6,
  "title": "Mini-Project — Parallel URL Fetcher",
  "objective": "Build a console tool that fetches multiple URLs concurrently with Task.WhenAll, reports timing, respects a cancellation timeout, and handles individual failures gracefully.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Everything you have learned about `async`/`await`, `Task.WhenAll`, `CancellationToken`, and error handling comes together in this mini-project. You will build a real console tool that fires HTTP requests at multiple URLs **simultaneously**, collects results and timings, handles failures per-URL so one bad endpoint cannot ruin the whole batch, and cancels the entire operation if a global timeout fires. By the end you will have a pattern you can drop into production aggregator services, health-checkers, and CI scripts tomorrow."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This lesson is the capstone of the async module. Resist the urge to skip straight to the final code — walk through each evolution step so students see WHY each piece exists.",
        "Students from Python will recognise the asyncio.gather() fan-out pattern but will be surprised that C# does it without an event loop visible to them. Highlight that parallel = start all tasks, THEN await WhenAll.",
        "The per-URL try/catch wrapping is the single most-missed pattern in code reviews. Make it visceral: ask 'what happens to your other 9 URLs if URL #3 throws and you have no per-task catch?'",
        "Timing with Stopwatch is a teachable moment: show that all tasks running truly in parallel should take roughly as long as the slowest single request, not the sum.",
        "Demo the timeout by setting it to 1 ms to watch OperationCanceledException fire immediately. Then show a realistic 10-second timeout."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What We Are Building",
      "id": "what-we-are-building"
    },
    {
      "kind": "paragraph",
      "text": "Our tool accepts a list of URLs, fetches them all **at the same time** using a shared `HttpClient`, and prints a tidy report: status code (or error message), byte count of the response body, and wall-clock time for each URL. A global timeout — configurable at construction — cancels the entire batch if it has not finished within the deadline. Individual URL failures are captured and reported without aborting the remaining requests."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Things this project practices",
          "items": [
            "`Task.WhenAll` for true parallel fan-out",
            "Per-task `try/catch` to isolate failures",
            "`CancellationTokenSource.CancelAfter` for global timeout",
            "`Stopwatch` for wall-clock timing",
            "`HttpClient` reuse (one instance, many requests)",
            "`async Task Main` entry point"
          ]
        },
        {
          "title": "Things this project avoids (and why)",
          "items": [
            "No `.Result` / `.Wait()` — would block threads and could deadlock",
            "No `async void` — every async method returns `Task`",
            "No sequential `await` in a loop — that would serialize the fetches",
            "No shared mutable state between tasks — each task owns its result object",
            "No `new HttpClient()` per request — that leaks sockets"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 1 — The Result Record",
      "id": "step-1-result-record"
    },
    {
      "kind": "paragraph",
      "text": "Start by defining a plain data record that holds everything we want to report for one URL. Using a `record` keeps it immutable and gives us a free `ToString` for debugging."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "FetchResult.cs",
      "code": "namespace UrlFetcher;\n\npublic record FetchResult(\n    string Url,\n    bool Success,\n    int? StatusCode,\n    long? Bytes,\n    TimeSpan Elapsed,\n    string? ErrorMessage);"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 2 — The Fetcher Class",
      "id": "step-2-fetcher-class"
    },
    {
      "kind": "paragraph",
      "text": "Next, build the class that owns the `HttpClient` and knows how to fetch **one** URL safely. The trick is keeping the per-URL method focused and testable — all the parallelism lives one layer up."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ParallelFetcher.cs",
      "code": "using System.Diagnostics;\nusing System.Net.Http;\n\nnamespace UrlFetcher;\n\npublic sealed class ParallelFetcher : IDisposable\n{\n    private readonly HttpClient _http;\n    private readonly TimeSpan _timeout;\n\n    public ParallelFetcher(TimeSpan timeout)\n    {\n        _timeout = timeout;\n        // One HttpClient for the lifetime of the fetcher.\n        // HttpClient is thread-safe and designed to be reused.\n        _http = new HttpClient();\n        _http.DefaultRequestHeaders.UserAgent.ParseAdd(\"UrlFetcher/1.0\");\n    }\n\n    // Fetch ONE url — never throws; all errors become FetchResult.Success=false\n    private async Task<FetchResult> FetchOneAsync(\n        string url,\n        CancellationToken cancellationToken)\n    {\n        var sw = Stopwatch.StartNew();\n        try\n        {\n            using var response = await _http\n                .GetAsync(url, HttpCompletionOption.ResponseContentRead, cancellationToken)\n                .ConfigureAwait(false);\n\n            byte[] body = await response.Content\n                .ReadAsByteArrayAsync(cancellationToken)\n                .ConfigureAwait(false);\n\n            sw.Stop();\n            return new FetchResult(\n                Url: url,\n                Success: response.IsSuccessStatusCode,\n                StatusCode: (int)response.StatusCode,\n                Bytes: body.LongLength,\n                Elapsed: sw.Elapsed,\n                ErrorMessage: response.IsSuccessStatusCode\n                    ? null\n                    : $\"HTTP {(int)response.StatusCode} {response.ReasonPhrase}\");\n        }\n        catch (OperationCanceledException)\n        {\n            sw.Stop();\n            // Rethrow — the global timeout fired and the caller needs to know.\n            throw;\n        }\n        catch (Exception ex)\n        {\n            sw.Stop();\n            // Network error, DNS failure, TLS error, etc.\n            // Return a failure result instead of propagating — other URLs should still succeed.\n            return new FetchResult(\n                Url: url,\n                Success: false,\n                StatusCode: null,\n                Bytes: null,\n                Elapsed: sw.Elapsed,\n                ErrorMessage: ex.Message);\n        }\n    }\n\n    // Fetch ALL urls in parallel; honour global timeout via CancellationTokenSource\n    public async Task<IReadOnlyList<FetchResult>> FetchAllAsync(IEnumerable<string> urls)\n    {\n        using var cts = new CancellationTokenSource();\n        cts.CancelAfter(_timeout); // global deadline for the whole batch\n\n        // Start every request immediately — do NOT await inside the projection\n        List<Task<FetchResult>> tasks = urls\n            .Select(url => FetchOneAsync(url, cts.Token))\n            .ToList();\n\n        // Wait for all tasks. If the timeout fires, cts cancels them all\n        // and the awaiting tasks throw OperationCanceledException.\n        FetchResult[] results = await Task.WhenAll(tasks).ConfigureAwait(false);\n        return results;\n    }\n\n    public void Dispose() => _http.Dispose();\n}"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The silent serialization trap",
      "text": "The most common async mistake when building this kind of fan-out is writing `foreach (var url in urls) { results.Add(await FetchOneAsync(url, ct)); }`. That **awaits each request before starting the next**, making the total time the **sum** of all latencies instead of the **maximum**. Always start all Tasks first (the `.Select(url => FetchOneAsync(...)).ToList()` line), then await the collection with `Task.WhenAll`."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Re-throw OperationCanceledException, swallow everything else",
      "text": "Notice that `FetchOneAsync` has **two** catch blocks. `OperationCanceledException` is re-thrown so the global timeout propagates correctly — if you swallow it, the caller can never tell that the timeout fired. All other exceptions are converted to a failure `FetchResult` so one bad URL cannot kill the rest of the batch. This two-catch pattern is a production staple."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 3 — The Entry Point and Report Printer",
      "id": "step-3-entry-point"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Diagnostics;\nusing UrlFetcher;\n\nstring[] urls =\n[\n    \"https://httpbin.org/get\",\n    \"https://httpbin.org/status/404\",\n    \"https://httpbin.org/delay/2\",\n    \"https://this-domain-does-not-exist.example/page\",\n    \"https://httpbin.org/bytes/1024\",\n];\n\nusing var fetcher = new ParallelFetcher(timeout: TimeSpan.FromSeconds(10));\n\nvar wallClock = Stopwatch.StartNew();\n\nIReadOnlyList<FetchResult> results;\ntry\n{\n    results = await fetcher.FetchAllAsync(urls);\n}\ncatch (OperationCanceledException)\n{\n    Console.WriteLine(\"[TIMEOUT] The global 10-second deadline was exceeded.\");\n    return;\n}\n\nwallClock.Stop();\n\nConsole.WriteLine($\"Fetched {results.Count} URL(s) in {wallClock.Elapsed.TotalSeconds:F2}s total\\n\");\nConsole.WriteLine($\"{\"URL\",-45} {\"Status\",-8} {\"Bytes\",-8} {\"Time\",-10} Result\");\nConsole.WriteLine(new string('-', 95));\n\nforeach (var r in results)\n{\n    string status  = r.StatusCode?.ToString() ?? \"N/A\";\n    string bytes   = r.Bytes?.ToString(\"N0\")  ?? \"N/A\";\n    string elapsed = $\"{r.Elapsed.TotalMilliseconds:F0} ms\";\n    string outcome = r.Success ? \"OK\" : $\"FAIL — {r.ErrorMessage}\";\n\n    // Truncate long URLs so the table stays readable\n    string displayUrl = r.Url.Length > 43 ? r.Url[..40] + \"...\" : r.Url;\n\n    Console.WriteLine($\"{displayUrl,-45} {status,-8} {bytes,-8} {elapsed,-10} {outcome}\");\n}"
    },
    {
      "kind": "output",
      "label": "Sample run (timings vary; httpbin.org is a real public testing service)",
      "output": "Fetched 5 URL(s) in 2.31s total\n\nURL                                           Status   Bytes    Time       Result\n-----------------------------------------------------------------------------------------------\nhttps://httpbin.org/get                       200      310      198 ms     OK\nhttps://httpbin.org/status/404                404      0        201 ms     FAIL — HTTP 404 Not Found\nhttps://httpbin.org/delay/2                   200      312      2187 ms    OK\nhttps://this-domain-does-not-exist.examp...   N/A      N/A      103 ms     FAIL — No such host is known.\nhttps://httpbin.org/bytes/1024                200      1,024    195 ms     OK"
    },
    {
      "kind": "paragraph",
      "text": "Notice that the wall-clock time is **2.31 seconds** — roughly the time of the slowest single request (`/delay/2`), not the sum of all five requests. That is the payoff of true parallel fan-out. In a sequential loop the same five requests would take roughly **2.9 seconds total** (the sum of all five individual request times)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "How the Timeout Works",
      "id": "how-the-timeout-works"
    },
    {
      "kind": "paragraph",
      "text": "When you construct `ParallelFetcher` with a timeout of `TimeSpan.FromSeconds(10)`, `FetchAllAsync` creates a `CancellationTokenSource` and calls `cts.CancelAfter(TimeSpan.FromSeconds(10))`. That single token is passed to **every** individual `FetchOneAsync` call. If the 10-second deadline fires before all tasks complete, the `CancellationTokenSource` triggers, all in-progress `HttpClient` calls receive the cancellation signal and throw `OperationCanceledException`, and `Task.WhenAll` surfaces that exception to the caller. The caller's `try/catch` prints a timeout message and exits. Try it yourself by setting the timeout to `TimeSpan.FromMilliseconds(50)` — the `/delay/2` request will be cut off immediately."
    },
    {
      "kind": "examples",
      "intro": "Two common extensions to this pattern you will encounter in production:",
      "examples": [
        {
          "label": "Limiting concurrency with SemaphoreSlim (don't hammer 500 URLs at once)",
          "code": "// Add to ParallelFetcher: throttle to max N simultaneous requests\nprivate readonly SemaphoreSlim _throttle = new SemaphoreSlim(initialCount: 10);\n\nprivate async Task<FetchResult> FetchOneThrottledAsync(\n    string url,\n    CancellationToken cancellationToken)\n{\n    await _throttle.WaitAsync(cancellationToken).ConfigureAwait(false);\n    try\n    {\n        return await FetchOneAsync(url, cancellationToken).ConfigureAwait(false);\n    }\n    finally\n    {\n        _throttle.Release(); // always release, even on exception\n    }\n}"
        },
        {
          "label": "Streaming results with Task.WhenEach (.NET 9+ / .NET 10) as each URL finishes",
          "code": "// Process each result as soon as it completes, not after all are done\nList<Task<FetchResult>> tasks = urls\n    .Select(url => FetchOneAsync(url, cts.Token))\n    .ToList();\n\nawait foreach (var completedTask in Task.WhenEach(tasks).ConfigureAwait(false))\n{\n    FetchResult r = await completedTask; // re-await to surface exceptions\n    Console.WriteLine($\"[{DateTime.Now:HH:mm:ss.fff}] Finished {r.Url} — {(r.Success ? \"OK\" : \"FAIL\")}\");\n}"
        }
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Start all Tasks before awaiting any of them.** Use `.Select(...).ToList()` to launch every request, then `await Task.WhenAll(tasks)`. Awaiting inside a `foreach` loop serialises work that should be parallel.",
        "**Wrap per-task work in `try/catch` to isolate failures.** One bad URL must not prevent the other nine from completing. Re-throw `OperationCanceledException` so the global timeout still propagates.",
        "**Use `CancellationTokenSource.CancelAfter` for global timeouts.** Pass the single token to every downstream call. When the deadline fires, every in-flight operation is notified cooperatively.",
        "**Reuse `HttpClient`.** Creating a new instance per request leaks sockets. Inject or own one instance for the lifetime of the service.",
        "**Wall-clock time equals the slowest task, not the sum.** This is the key benefit of parallel fan-out. Use `Stopwatch` to make this visible in your reporting.",
        "**`Task.WhenEach` (available in .NET 9+ / .NET 10) lets you process results in completion order** without waiting for the whole batch — ideal for streaming progress to a UI or a streaming HTTP response.",
        "**`ConfigureAwait(false)` in library/service code** avoids unnecessary context switches and prevents deadlocks if this code is ever called from a context-aware environment like WinForms or WPF."
      ]
    }
  ]
};
