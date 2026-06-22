import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "why-async",
  "number": 1,
  "title": "Why Async — Blocking vs Non-Blocking",
  "objective": "Understand threads, the thread pool, and why async-await lets a web server handle thousands of concurrent requests with far fewer threads than synchronous blocking code.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Before you write a single `await`, you need to understand the problem it solves. This lesson is about **why** async exists — the physics of threads, the cost of blocking, and the moment of clarity when you realize a web server can juggle ten thousand simultaneous requests with a handful of threads. If you have ever wondered why every .NET tutorial screams \"never block on async,\" this is where you find out."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Draw the thread pool diagram on a whiteboard: fixed-size pool, requests arriving, threads blocked on I/O, pool exhaustion. Let students feel the bottleneck before introducing the fix.",
        "Students coming from Python's asyncio may assume C# async is also single-threaded cooperative multitasking. Correct this early: .NET has real OS threads in a pool, and async frees them during waits rather than context-switching between coroutines on one thread.",
        "The restaurant analogy (waiters vs. kitchen staff) lands well for most beginners — use it early and refer back to it throughout the lesson.",
        "Do NOT introduce Task, ValueTask, or the state machine yet. This lesson is purely motivational. Those come in later lessons.",
        "Run the synchronous HTTP example in a live demo if possible — students can watch thread pool exhaustion with a simple load test using `dotnet-httprepl` or a browser."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Restaurant Analogy",
      "id": "restaurant-analogy"
    },
    {
      "kind": "paragraph",
      "text": "Imagine a restaurant where each waiter is assigned to exactly one customer and must stand beside that customer's table — motionless, staring — for the entire time the kitchen is cooking their meal. The waiter cannot seat another guest, take another order, or refill anyone's water. They just wait. With twenty waiters you can serve twenty customers simultaneously. When the twenty-first customer walks in, they stand at the door indefinitely.\n\nThat is **synchronous blocking I/O** in a web server. Each incoming HTTP request is assigned a thread from the .NET ThreadPool. If that thread's first act is to block on I/O — reading a file, waiting for a database query, or calling a downstream HTTP service — the thread freezes, kernel-blocked, until the disk or network responds. It is your waiter staring at the kitchen pass."
    },
    {
      "kind": "paragraph",
      "text": "A smarter restaurant trains its waiters differently. The waiter takes your order, walks it to the kitchen, and immediately returns to the dining room to seat the next guest, take the next order, or deliver food that is already ready. When your meal is done, any available waiter picks it up and brings it to you. Twenty waiters can now serve two hundred simultaneous diners because each waiter is **never blocked waiting**. This is async I/O. The thread is returned to the pool while the I/O is in flight, and a thread (possibly a different one) resumes your request when the data arrives."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What a Thread Actually Costs",
      "id": "thread-cost"
    },
    {
      "kind": "paragraph",
      "text": "Threads are not free. In .NET 10 on a 64-bit process, each thread carries a default stack reservation of **1 MB** (the committed pages grow on demand, but the virtual address space is reserved immediately). Beyond memory, each thread involves:\n\n- An OS kernel object and a scheduling slot in the CPU scheduler.\n- **Context switching** cost — when the OS preempts a thread and runs another, it must save and restore all CPU registers. At high concurrency this overhead compounds.\n- A minimum warm-up time of roughly **a millisecond** for the ThreadPool to spin up a new thread when demand spikes — too slow for bursty request traffic.\n\nThe .NET ThreadPool mitigates some of this by reusing threads rather than creating and destroying them. But it has a **concurrency throttle**: by default, one thread per logical CPU core can be created immediately (the minimum thread count), and additional threads are injected at a rate of roughly one per 500 ms by the hill-climbing algorithm. Under a sudden burst of 500 blocking requests on a four-core machine, hundreds of requests queue up while the pool slowly grows."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Seeing the Problem in Code",
      "id": "blocking-code"
    },
    {
      "kind": "paragraph",
      "text": "Here is a minimal ASP.NET Core endpoint written in the synchronous blocking style. It fetches a remote API and returns the response to the caller. Notice that `HttpClient` has no synchronous `GetString` method — it is an async-only API by design. The only way to call it synchronously is to block on the returned Task with `.Result`, which is exactly what makes this code dangerous."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// .NET 10 — Synchronous (blocking) style. DO NOT ship this.\nvar builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet(\"/weather\", () =>\n{\n    // HttpClient.GetStringAsync(...).Result blocks the calling thread until\n    // the HTTP response arrives. During that wait, this ThreadPool thread\n    // cannot serve any other request.\n    using var http = new HttpClient();\n    string json = http.GetStringAsync(\"https://wttr.in/?format=j1\").Result; // <-- BLOCKS\n    return json;\n});\n\napp.Run();"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Never call .Result (or .Wait()) inside a request handler",
      "text": "`.Result` blocks the current thread until the Task completes. In environments with a `SynchronizationContext` (WinForms, WPF, ASP.NET classic) this causes a **deadlock** — the blocked thread holds the context, and the completion callback needs that same context to run. ASP.NET Core deliberately has no `SynchronizationContext`, so you will not deadlock there — but blocking with `.Result` still wastes a ThreadPool thread for the entire duration of the I/O, which is exactly the problem async was designed to eliminate. Under load, this exhausts the pool and cascades into request timeouts across the entire service."
    },
    {
      "kind": "paragraph",
      "text": "Now watch what changes with the async version of exactly the same endpoint."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// .NET 10 — Async (non-blocking) style. This is correct.\nvar builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet(\"/weather\", async () =>\n{\n    // await releases the ThreadPool thread back to the pool while the HTTP call is in flight.\n    // When the response arrives, a (possibly different) thread picks up and continues.\n    using var http = new HttpClient();\n    string json = await http.GetStringAsync(\"https://wttr.in/?format=j1\"); // <-- NON-BLOCKING\n    return json;\n});\n\napp.Run();"
    },
    {
      "kind": "paragraph",
      "text": "The code looks nearly identical. The difference is `async` on the lambda, `await` before the call, and **no** `.Result`. Yet the runtime behaviour is completely different: the thread that received the HTTP request is **returned to the ThreadPool** the moment it hits `await`. It is free to handle another incoming request while the network call is in progress. When the response bytes arrive (driven by the OS network stack, not a thread), .NET schedules a continuation and a pooled thread picks up the handler where it left off."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A Python Developer's Frame of Reference",
      "id": "python-comparison"
    },
    {
      "kind": "paragraph",
      "text": "If you have used Python's `asyncio`, the surface-level similarity is obvious: both languages use `async def` / `async` functions and `await` expressions. But the underlying model differs in one important way."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python asyncio",
          "items": [
            "Single-threaded event loop — only one coroutine runs at a time.",
            "True cooperative multitasking: a coroutine runs until it explicitly yields with `await`.",
            "CPU-bound code blocks the entire loop — you must `loop.run_in_executor()` to escape.",
            "`asyncio.run()` is the explicit entry point; you manage the event loop.",
            "Coroutines are lazy — they don't start until awaited or scheduled with `create_task()`."
          ]
        },
        {
          "title": "C# async / .NET ThreadPool",
          "items": [
            "Real OS threads in a managed pool — multiple continuations can run in parallel.",
            "Cooperative at the `await` point, but the pool can run many continuations simultaneously on different cores.",
            "CPU-bound work can be offloaded with `Task.Run(...)` to a separate pool thread without blocking the caller.",
            "No explicit event loop — the runtime (and `SynchronizationContext` in UI apps) manages scheduling.",
            "An `async` method starts running synchronously on the caller's thread up to its first `await`."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "The key mental shift from Python",
      "text": "In Python asyncio, \"concurrent\" means interleaved on one thread. In .NET, \"concurrent\" can mean **truly parallel** — multiple threads running your async continuations at the same time on different CPU cores. This makes C# async both more powerful (real parallelism) and trickier (shared-state race conditions are possible in a way they simply are not in single-threaded asyncio)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Scale Numbers",
      "id": "scale-numbers"
    },
    {
      "kind": "paragraph",
      "text": "To make the performance difference concrete, consider a web API endpoint that calls a downstream service taking 200 ms to respond. Assume a four-core server with a ThreadPool ceiling of 1,000 threads (used here for illustration — real servers often tune this value based on load profile)."
    },
    {
      "kind": "list",
      "items": [
        "**Synchronous blocking:** each request occupies one thread for the full 200 ms. Maximum throughput = 1,000 threads ÷ 0.2 s = **5,000 requests/second** at the ceiling. In practice you hit queuing effects and latency spikes well before that ceiling.",
        "**Async non-blocking:** threads are held only for the microseconds of CPU work (parsing, serialisation). A thread busy for 0.1 ms per request at 200 ms I/O latency means the same 1,000 threads can theoretically serve 1,000 ÷ 0.0001 = **10,000,000 requests/second** of CPU capacity — the bottleneck shifts to network bandwidth, not threads.",
        "Real-world .NET async web services routinely sustain **50,000–100,000 requests/second** on commodity hardware with thread pools of a few hundred threads. The same code written synchronously saturates and fails at a fraction of that load."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "I/O-bound vs CPU-bound — the most important distinction",
      "text": "Async shines for **I/O-bound** work: database queries, HTTP calls to downstream services, file reads, queue receives. For these, the thread would otherwise sit idle waiting for hardware. For **CPU-bound** work (image processing, encryption, complex calculations), async alone does not help — the thread is genuinely busy. For CPU-bound work you use `Task.Run(...)` to move the computation to a pool thread and keep the calling context free. Knowing which kind of work you have is the first question to ask every time you write an async method."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What Happens at an await Point",
      "id": "await-mechanics"
    },
    {
      "kind": "paragraph",
      "text": "When the .NET runtime hits an `await` on an incomplete operation, it does four things in rapid succession:\n\n1. **Captures state** — local variables and the current position in the method are saved (the compiler turns the method into a state machine; we will explore this in a later lesson).\n2. **Registers a callback** — the runtime attaches a continuation to the Task being awaited. When the Task completes, this callback fires.\n3. **Returns control to the caller** — execution returns up the call stack. The ThreadPool thread is no longer tied to your request and immediately picks up the next pending work item.\n4. **Resumes later** — when the I/O finishes (driven by the OS), the runtime picks an available ThreadPool thread, restores the saved state, and continues the method body after the `await` expression.\n\nFrom the perspective of your code, nothing changed — the next line after `await` runs with the same local variables. From the perspective of the server, a thread was busy for microseconds rather than milliseconds."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Threads are expensive.** Each carries ~1 MB of stack, an OS kernel object, and scheduling overhead. A web server cannot afford one thread per request at scale.",
        "**Blocking wastes threads.** When a thread calls a synchronous I/O method, it freezes — consuming memory and a scheduler slot — while the CPU sits idle waiting for disk or network hardware.",
        "**async/await solves the blocking problem** by releasing the thread back to the pool during I/O waits. Threads are only held for the microseconds of actual CPU work between await points.",
        "**C# async is not Python asyncio.** .NET uses real OS threads in a pool; multiple async continuations can run in parallel on different cores. Shared-state race conditions are possible in a way they are not in single-threaded Python asyncio.",
        "**I/O-bound vs CPU-bound matters.** async/await eliminates wasted thread blocking for I/O-bound work. CPU-bound work needs `Task.Run(...)` to move computation off the calling thread.",
        "**Never call `.Result` or `.Wait()`** inside a request handler or library code. In contexts with a `SynchronizationContext` it causes a deadlock; in ASP.NET Core (no SynchronizationContext) it avoids the deadlock but still wastes a pool thread and destroys the scalability benefit of async."
      ]
    }
  ]
};
