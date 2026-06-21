import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "finally-using",
  "number": 2,
  "title": "finally & using — Guaranteed Cleanup",
  "objective": "Guarantee cleanup with finally, and use the using statement/declaration to dispose resources (files, connections) deterministically.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every real program borrows things it must give back — an open file, a database connection, a network socket, a lock. The hard question is not *how* you grab them, but how you guarantee you let go **even when something blows up halfway through**. That guarantee is what `finally` and `using` are for."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor this lesson in the previous one: students now know try/catch. The hook is the gap try/catch leaves — cleanup. Ask out loud: \"If an exception is thrown after you open a file, who closes it?\"",
        "The single biggest payoff to land: `using` is just `try/finally { Dispose() }` that the compiler writes for you. Show the desugared form once so it stops being magic.",
        "Python bridge is strong here: `using` ≈ `with`, `IDisposable.Dispose` ≈ `__exit__`/`close`. Lean on it, but flag the difference: Python's `with` calls `__enter__` on entry; C# `using` does NOT call anything on entry — the object is already constructed before `using` ever sees it. `using` only schedules the *exit*.",
        "Stress that `try`/`finally` is legal with NO `catch` — beginners assume `finally` requires a `catch`. The cleanup-only `try`/`finally` is extremely common.",
        "Demonstrate the order-of-disposal rule for stacked `using` declarations (reverse, LIFO) live — beginners almost never guess it.",
        "Pre-empt the #1 confusion: `finally` runs even on `return`. Run the FinallyVsReturn example and let them predict the output before revealing it.",
        "If time allows, mention IAsyncDisposable / `await using` as the async sibling, but keep it a one-liner — it's a teaser for the async lesson, not the focus."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The gap that try/catch leaves",
      "id": "the-cleanup-gap"
    },
    {
      "kind": "paragraph",
      "text": "`try`/`catch` answers \"what do I do when something goes wrong?\" But there's a second, quieter question: \"what must happen **no matter what** — success, failure, or early exit?\" Closing a file, returning a database connection to the pool, releasing a lock. If you only close the file on the happy path, an exception leaks the handle, and leaked handles are exactly the bug that takes down a server at 3 a.m. when it finally runs out of them."
    },
    {
      "kind": "paragraph",
      "text": "Consider this broken-but-tempting code. The `Close()` call looks fine — until `Process` throws and execution jumps straight to the `catch`, skipping `file.Close()` entirely. The `catch` handles the *error*, but nobody ever releases the file:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Leaky.cs",
      "code": "var file = File.OpenText(\"orders.csv\");\ntry\n{\n    Process(file.ReadToEnd());\n    file.Close();          // never runs if Process throws!\n}\ncatch (Exception ex)\n{\n    Console.WriteLine($\"Failed: {ex.Message}\");\n    // we logged the error, but the OS file handle is still open — it leaks\n}"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "finally: the block that always runs",
      "id": "finally"
    },
    {
      "kind": "paragraph",
      "text": "A `finally` block runs **after** the `try` (and after any matching `catch`) regardless of how control leaves the `try` — whether it falls off the end normally, throws an exception, or hits a `return`, `break`, or `continue`. This is identical in spirit to Python's `finally`. Put cleanup there and it cannot be skipped:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Finally.cs",
      "code": "var file = File.OpenText(\"orders.csv\");\ntry\n{\n    Process(file.ReadToEnd());\n}\ncatch (IOException ex)\n{\n    Console.WriteLine($\"I/O failed: {ex.Message}\");\n}\nfinally\n{\n    file.Close();          // runs on success AND on exception\n    Console.WriteLine(\"File closed.\");\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "You don't need a catch to use finally",
      "text": "A common beginner assumption is that `finally` requires a `catch`. It does not. A bare `try`/`finally` with **no** `catch` is completely legal and very common: it says \"I'm not handling the error here — let it keep propagating — but on the way out, *clean up*.\" The exception still travels up to whoever can handle it; the `finally` simply runs first. Use this whenever you must release a resource but want the error itself dealt with higher up."
    },
    {
      "kind": "paragraph",
      "text": "The surprising-the-first-time part: `finally` even beats `return`. The runtime evaluates the return value, then runs `finally`, then actually hands control back to the caller. Watch the order here — the `finally` prints *before* the method's result is used:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "FinallyVsReturn.cs",
      "code": "int GetValue()\n{\n    try\n    {\n        Console.WriteLine(\"computing...\");\n        return 42;          // value captured here\n    }\n    finally\n    {\n        Console.WriteLine(\"finally runs before the caller sees the result\");\n    }\n}\n\nConsole.WriteLine($\"got {GetValue()}\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "computing...\nfinally runs before the caller sees the result\ngot 42"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Never return or throw from inside finally",
      "text": "Because `finally` runs last, a `return` or `throw` placed inside it **overrides** whatever the `try` was doing — silently swallowing an in-flight exception or replacing your real return value. If `Process` threw and your `finally` then throws while closing the file, the original error vanishes and you debug the wrong thing. The analyzer **CA2219** flags throwing from `finally` for exactly this reason. Keep `finally` to pure cleanup — no `return`, no `throw`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "IDisposable: the contract for \"I hold something that must be released\"",
      "id": "idisposable"
    },
    {
      "kind": "paragraph",
      "text": "Manually pairing every resource with a `finally` works, but it's noisy and easy to get wrong. .NET standardizes the pattern with one tiny interface, `IDisposable`, which declares a single method, `void Dispose()`. Any type that wraps an unmanaged or limited resource — `FileStream`, `StreamReader`, `SqlConnection`, `HttpClient`, `Socket`, even a database transaction — implements it. `Dispose()` is the moment you say \"I'm done, release it now.\" It is the close cousin of Python's `__exit__`/`close()`."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Dispose vs. the garbage collector",
      "text": "C# is garbage-collected like Python, so memory is reclaimed for you. But the GC is **non-deterministic** — it runs whenever it decides to, which might be seconds later or not before your file-handle limit is hit. A held file lock or open connection can't wait for that. `Dispose()` gives you **deterministic** release: the resource is freed at a precise, known point in your code, not whenever the collector wakes up."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "For Python folks: using ≈ with, but entry differs",
      "text": "`using` is C#'s `with` statement. `IDisposable.Dispose()` plays the role of `__exit__`/`close()`. One real difference worth knowing: Python's `with` calls `__enter__` on the object as you *enter* the block. C# `using` calls **nothing** on entry — the object is already fully constructed by the time `using` takes it, and `using` only schedules `Dispose()` for the *exit*. So in C#, the \"setup\" is just the constructor; `using` is purely about guaranteed teardown."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "using: the compiler writes the finally for you",
      "id": "using"
    },
    {
      "kind": "paragraph",
      "text": "The `using` statement takes any `IDisposable` and guarantees `Dispose()` is called when the block ends — through normal exit, an exception, or a `return`. It is precisely a `try`/`finally` that you didn't have to type. These two snippets compile to the same thing:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Manual try/finally",
          "items": [
            "`var reader = new StreamReader(\"orders.csv\");`",
            "`try {`",
            "`    Process(reader.ReadToEnd());`",
            "`} finally {`",
            "`    reader.Dispose();`",
            "`}`",
            "Correct, but you must remember the finally every time."
          ]
        },
        {
          "title": "using statement",
          "items": [
            "`using (var reader = new StreamReader(\"orders.csv\"))`",
            "`{`",
            "`    Process(reader.ReadToEnd());`",
            "`}`",
            "`// reader.Dispose() already called`",
            "The compiler generates the exact try/finally on the left — `Dispose` is also called if `Process` throws."
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Since C# 8 there's an even lighter form: the **`using` declaration**. Drop the parentheses and braces, and the resource is disposed automatically at the end of the **enclosing scope** (usually the method). This is the form you'll write most often in modern C#, because it removes a level of nesting:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "UsingDeclaration.cs",
      "code": "static string ReadFirstLine(string path)\n{\n    using var reader = new StreamReader(path);   // no braces needed\n    return reader.ReadLine() ?? \"\";\n    // reader.Dispose() runs here, at the closing brace of the method,\n    // even though we returned in the middle\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer using over a hand-written finally for resources",
      "text": "If a type implements `IDisposable`, reach for `using` (or `using var`) — not a manual `try/finally`. It's shorter, it can't be forgotten, and it's automatically exception-safe. Reserve `finally` for cleanup that *isn't* an `IDisposable`: restoring a flag, re-enabling a UI control, logging an \"operation ended\" marker. Rule of thumb: **`using` for objects, `finally` for actions.**"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Multiple and nested resources",
      "id": "nested-using"
    },
    {
      "kind": "paragraph",
      "text": "Real code rarely holds just one resource. A typical \"copy a file\" or \"run a query\" operation juggles several at once. Stack `using` declarations and each is disposed automatically — and crucially, in **reverse order** (last opened, first disposed, LIFO), which is exactly what you want so an inner resource never outlives the outer one it depends on:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "MultipleUsing.cs",
      "code": "static void CopyText(string source, string dest)\n{\n    using var input = new StreamReader(source);\n    using var output = new StreamWriter(dest);\n\n    string? line;\n    while ((line = input.ReadLine()) is not null)\n        output.WriteLine(line);\n\n    // At the end of the method:\n    //   output.Dispose() runs first  (opened last)\n    //   input.Dispose()  runs second (opened first)\n}"
    },
    {
      "kind": "paragraph",
      "text": "When you want the resources released *before* the method ends — say you open a connection, run a query, then do slow post-processing you don't want holding the connection open — use the braced `using` statement form to scope them tightly. The classic database example, where a command depends on a connection that depends on nothing, reads top-to-bottom and tears down bottom-to-top:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "QueryOrders.cs",
      "code": "using Microsoft.Data.SqlClient;\n\nstatic int CountPendingOrders(string connectionString)\n{\n    using (var connection = new SqlConnection(connectionString))\n    {\n        connection.Open();\n        using (var command = new SqlCommand(\n            \"SELECT COUNT(*) FROM Orders WHERE Status = 'Pending'\", connection))\n        {\n            return (int)command.ExecuteScalar();\n            // command disposed first, then connection — even though we returned\n        }\n    }\n}"
    },
    {
      "kind": "examples",
      "intro": "A few more shapes you'll meet in production code:",
      "examples": [
        {
          "label": "Lock release with finally (an action, not an IDisposable)",
          "code": "_gate.Wait();\ntry\n{\n    _balance += amount;       // critical section\n}\nfinally\n{\n    _gate.Release();          // always release, even if the section throws\n}"
        },
        {
          "label": "HttpClient response — using on the response, not the shared client",
          "code": "using var response = await httpClient.GetAsync(\"/api/orders\");\nresponse.EnsureSuccessStatusCode();\nvar json = await response.Content.ReadAsStringAsync();\n// response (and its network stream) disposed at method end"
        },
        {
          "label": "await using for async cleanup (IAsyncDisposable)",
          "code": "await using var connection = new SqlConnection(connectionString);\nawait connection.OpenAsync();\n// DisposeAsync() awaited at scope end — the async sibling of using"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "using var disposes at the end of the WHOLE scope",
      "text": "A `using` *declaration* keeps the resource alive until the closing brace of its enclosing block. If you put `using var connection = ...` at the top of a long method that then does ten seconds of CPU work, that connection stays open the whole time — needlessly holding a pooled resource. When you need a tighter lifetime, use the braced `using (...)` *statement* so the resource is released the instant its block ends, not the method."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Where this shows up in real systems",
      "id": "real-world"
    },
    {
      "kind": "list",
      "items": [
        "**Web APIs:** every database call in an ASP.NET Core endpoint wraps its `DbConnection`/`DbCommand` (or the EF Core `DbContext`) in `using` so connections return to the pool even when a request errors out — leaked connections exhaust the pool and stall the whole service.",
        "**File and report processing:** batch jobs that read CSVs and write Excel/PDF use stacked `using` declarations so file handles are released the moment each file is done, even on a malformed row mid-stream.",
        "**Concurrency:** `lock` statements and `SemaphoreSlim.Wait()/Release()` pairs rely on the compiler-generated (or hand-written) `finally` to release the lock if the critical section throws — a missed release here deadlocks every other thread.",
        "**Database transactions:** open a transaction, do several writes, `Commit()` at the end; the `using` ensures an un-committed transaction is rolled back on `Dispose()` if an exception escapes, so you never leave the database half-updated."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`finally` always runs — on success, on exception, and even after a `return`, `break`, or `continue`. Use it for cleanup that must not be skipped.",
        "`try`/`finally` needs **no** `catch`: a bare try/finally lets the exception keep propagating while still guaranteeing cleanup on the way out.",
        "Never `return` or `throw` from inside `finally`: it silently overrides the real result or swallows the in-flight exception (analyzer **CA2219**).",
        "`IDisposable.Dispose()` is .NET's standard \"release it now\" contract; it gives **deterministic** cleanup that the garbage collector cannot guarantee.",
        "A `using` statement is exactly a compiler-generated `try/finally` that calls `Dispose()` — shorter, exception-safe, and impossible to forget.",
        "The C# 8 `using` *declaration* (`using var x = ...`) disposes at the end of the enclosing scope; the braced `using (...)` *statement* disposes at the end of its block when you need a tighter lifetime.",
        "Stack multiple `using`s freely — they dispose in **reverse (LIFO)** order, so dependent inner resources are released before the outer ones they rely on.",
        "Rule of thumb: **`using` for objects** that implement `IDisposable`, **`finally` for actions** like releasing a lock or restoring state."
      ]
    }
  ]
};
