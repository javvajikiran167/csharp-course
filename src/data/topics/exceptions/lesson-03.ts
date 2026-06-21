import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "throw",
  "number": 3,
  "title": "Throwing & Re-Throwing Exceptions",
  "objective": "Throw exceptions deliberately, and re-throw correctly — understanding the critical difference between throw; and throw ex; for preserving the stack trace.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Catching exceptions is only half the story. The other half — the half that separates code that fails *loudly and clearly* from code that fails *silently and mysteriously* — is **throwing** them well. In this lesson you'll learn to raise exceptions on purpose, pick the right type, and re-throw without destroying the one piece of evidence that tells you where things actually went wrong: the **stack trace**."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor the whole lesson on the `throw;` vs `throw ex;` distinction — it is *the* most common C# interview question on exceptions and a real production bug. Show the two stack traces side by side; the difference is visceral once they see it.",
        "Students from Python will reach for `raise` (re-raise) and `raise X from Y`. Map these explicitly: `throw;` == bare `raise`, and `throw new X(\"...\", inner)` == `raise X from inner`. That mapping makes the lesson click fast.",
        "Stress that throwing is a design decision, not a panic button: a thrown exception is a contract that says 'I cannot meet my promise; the caller must deal with it.' Tie it to guard clauses — fail at the boundary, fail fast, fail with a precise message.",
        "The propagation point ('when to NOT catch') is counterintuitive for beginners who feel they must wrap everything in try/catch. Hammer: catching and re-throwing with no added value is worse than not catching at all.",
        "All code/outputs here were compiled and run on .NET 10 / C# 14. The CA2200 analyzer warning on `throw ex;` is real and shows up in the build — mention that the tooling itself nags you. The stack-trace line numbers in the output correspond exactly to the lines in the printed code block, so you can point at them live."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Throwing to signal failure",
      "id": "throwing-to-signal"
    },
    {
      "kind": "paragraph",
      "text": "A method has a job. When it cannot do that job — bad arguments, an impossible state, a missing file — it must not return a wrong answer or quietly limp on. It should **stop and announce the failure** so the caller can decide what to do. In C# you announce failure with the `throw` keyword followed by an exception object. This is the mirror image of Python's `raise`."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python",
          "items": [
            "`raise ValueError(\"...\")`",
            "`raise` (bare) re-raises in an `except`",
            "`raise X(\"...\") from err` chains a cause",
            "Any object subclassing `BaseException`"
          ]
        },
        {
          "title": "C#",
          "items": [
            "`throw new ArgumentException(\"...\");`",
            "`throw;` (bare) re-throws in a `catch`",
            "`throw new X(\"...\", inner);` chains a cause",
            "Any object whose type derives from `System.Exception`"
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Here is a tiny pricing helper from a real e-commerce backend. A discount percent below 0 or above 100 is nonsense, so rather than silently clamping it (which would hide a calling bug), it throws. Notice the constructor: `ArgumentOutOfRangeException` lets you pass the **parameter name**, the **actual bad value**, and a human-readable **message** — all three end up in the formatted output, which is gold when you're reading a log at 2 a.m."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static decimal ApplyDiscount(decimal price, decimal percent)\n{\n    if (percent < 0 || percent > 100)\n        throw new ArgumentOutOfRangeException(\n            nameof(percent), percent, \"Discount percent must be between 0 and 100.\");\n\n    return price - (price * percent / 100m);\n}\n\ntry\n{\n    Console.WriteLine(ApplyDiscount(100m, 20m));   // fine\n    Console.WriteLine(ApplyDiscount(100m, 150m));  // throws\n}\ncatch (ArgumentOutOfRangeException ex)\n{\n    Console.WriteLine($\"Rejected: {ex.Message}\");\n}"
    },
    {
      "kind": "output",
      "output": "80\nRejected: Discount percent must be between 0 and 100. (Parameter 'percent')\nActual value was 150.",
      "label": "Program output"
    },
    {
      "kind": "paragraph",
      "text": "The framework appended `(Parameter 'percent')` and `Actual value was 150.` for you — that's the payoff for using the right typed exception with its richer constructor instead of a generic one. Write your `Message` as a complete sentence ending in a period; never rely on the class name alone to explain what went wrong."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Choosing the right built-in exception",
      "id": "choosing-a-type"
    },
    {
      "kind": "paragraph",
      "text": "Before you invent your own exception, reach for one of the well-known built-in types. Picking the *semantically correct* type lets callers (and middleware) react intelligently — e.g. map all `ArgumentException`s to an HTTP 400 in a web API. Here is the everyday decision table."
    },
    {
      "kind": "list",
      "items": [
        "**Bad argument value** → `ArgumentException`, or its children `ArgumentNullException` (null) and `ArgumentOutOfRangeException` (out of range).",
        "**Object is in a state where this call makes no sense** (e.g. reading from a closed connection, popping an empty stack) → `InvalidOperationException`.",
        "**A feature isn't implemented yet** → `NotImplementedException`; **a feature will never be supported on this type** → `NotSupportedException`.",
        "**Disposed object used after `Dispose()`** → `ObjectDisposedException`.",
        "**Operation was cancelled** (async) → `OperationCanceledException` (its subclass `TaskCanceledException` is what cancellation tokens throw).",
        "**A genuinely domain-specific failure** that callers need to catch distinctly → write a custom exception (next lesson)."
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Do not throw these reserved types",
      "text": "Never `throw` `NullReferenceException`, `IndexOutOfRangeException`, `AccessViolationException`, `StackOverflowException`, or the bare base types `Exception` / `SystemException` / `ApplicationException`. The runtime owns the first group — throwing them yourself disguises your *intentional* signal as one of the CLR's own bug indicators, confusing everyone. The base types are too vague to catch meaningfully. The analyzer **CA2201** flags exactly this. Throw a specific type instead: `InvalidOperationException` for bad state, the `Argument*` family for bad inputs."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Guard clauses: fail fast at the boundary",
      "id": "guard-clauses"
    },
    {
      "kind": "paragraph",
      "text": "The single most common throwing code in modern professional C# lives in the first few lines of a method or constructor: **guard clauses** that validate inputs and bail immediately if they're wrong. .NET 10 gives you a family of static `ThrowIf...` helpers so you never hand-write `if (x is null) throw ...` again. They read like assertions, and the analyzers **CA1510–CA1513** will even suggest converting your hand-written `if`/`throw` into them."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static void Register(string email, int age)\n{\n    ArgumentException.ThrowIfNullOrWhiteSpace(email);\n    ArgumentOutOfRangeException.ThrowIfNegativeOrZero(age);\n\n    Console.WriteLine($\"Registered {email}, age {age}.\");\n}\n\n// Helper so we can see each guard's message without crashing the demo:\nstatic void Try(Action a)\n{\n    try { a(); }\n    catch (Exception ex) { Console.WriteLine(ex.Message); }\n}\n\nTry(() => Register(\"ada@example.com\", 36));   // works\nTry(() => Register(\"   \", 36));               // throws ArgumentException\nTry(() => Register(\"grace@example.com\", 0));  // throws ArgumentOutOfRangeException",
      "filename": "Guards.cs"
    },
    {
      "kind": "output",
      "output": "Registered ada@example.com, age 36.\nThe value cannot be an empty string or composed entirely of whitespace. (Parameter 'email')\nage ('0') must be a non-negative and non-zero value. (Parameter 'age')\nActual value was 0.",
      "label": "Each guard's message, printed by the Try helper"
    },
    {
      "kind": "paragraph",
      "text": "Look closely: nobody passed the *name* `\"email\"` or `\"age\"` anywhere, yet the messages say `(Parameter 'email')` and `(Parameter 'age')`. The helpers use the `[CallerArgumentExpression]` attribute to capture the **caller's expression text automatically** at compile time. This is why you must **not** pass `nameof(email)` yourself — it's redundant, and if you pass the wrong thing you'll get a misleading message."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "The full ThrowIf toolbox",
      "text": "Beyond the two above: `ArgumentNullException.ThrowIfNull(x)`, `ArgumentException.ThrowIfNullOrEmpty(s)`, the whole `ArgumentOutOfRangeException` numeric family (`ThrowIfNegative`, `ThrowIfZero`, `ThrowIfGreaterThan`, `ThrowIfLessThanOrEqual`, `ThrowIfEqual`, …, all generic over `INumber<T>`), and `ObjectDisposedException.ThrowIf(condition, this)`. Reach for these first — they're shorter, consistent, and produce better messages than hand-rolled `if`/`throw`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The interview trap: throw; vs throw ex;",
      "id": "throw-vs-throw-ex"
    },
    {
      "kind": "paragraph",
      "text": "Now the centerpiece. Inside a `catch` block you'll often want to do *something* — log, increment a metric — and then let the exception keep going. There are two ways to write that, and they look almost identical, but **one of them quietly destroys your evidence.**"
    },
    {
      "kind": "examples",
      "intro": "Inside a catch block:",
      "examples": [
        {
          "label": "throw;  — re-throws the SAME exception, keeping its original stack trace intact",
          "code": "catch (Exception)\n{\n    // log...\n    throw;        // caller sees where the error REALLY started\n}"
        },
        {
          "label": "throw ex;  — throws the caught object again, RESETTING the stack trace to this line",
          "code": "catch (Exception ex)\n{\n    // log...\n    throw ex;     // original origin is erased (CA2200)\n}"
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "To prove it, here's a three-level call chain. `Deep()` triggers the real error; the two `Middle_*` methods catch and re-throw; top-level prints the resulting `StackTrace`. We run it once with `throw;` and once with `throw ex;` and compare what survives. The line numbers in the trace below match the lines in *this exact* code block."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static void Deep()\n{\n    int[] data = [];\n    _ = data[5];            // real error originates HERE (line 4)\n}\n\nstatic void Middle_GoodRethrow()\n{\n    try { Deep(); }         // call to Deep() is on line 9\n    catch (Exception)\n    {\n        throw;              // preserves original stack trace\n    }\n}\n\nstatic void Middle_BadRethrow()\n{\n    try { Deep(); }\n    catch (Exception ex)\n    {\n        throw ex;           // RESETS stack trace to THIS line (21)\n    }\n}\n\nConsole.WriteLine(\"=== throw; (good) ===\");\ntry { Middle_GoodRethrow(); }       // call on line 26\ncatch (Exception ex) { Console.WriteLine(ex.StackTrace); }\n\nConsole.WriteLine(\"\\n=== throw ex; (bad) ===\");\ntry { Middle_BadRethrow(); }        // call on line 30\ncatch (Exception ex) { Console.WriteLine(ex.StackTrace); }"
    },
    {
      "kind": "output",
      "output": "=== throw; (good) ===\n   at Program.<<Main>$>g__Deep|0_0() in Program.cs:line 4\n   at Program.<<Main>$>g__Middle_GoodRethrow|0_1() in Program.cs:line 9\n   at Program.<Main>$(String[] args) in Program.cs:line 26\n\n=== throw ex; (bad) ===\n   at Program.<<Main>$>g__Middle_BadRethrow|0_2() in Program.cs:line 21\n   at Program.<Main>$(String[] args) in Program.cs:line 30",
      "label": "Stack traces compared"
    },
    {
      "kind": "paragraph",
      "text": "Read those two traces. With `throw;` the trace still names **`Deep`, line 4** — the true scene of the crime. With `throw ex;` the trace *starts at line 21*, the re-throw line; `Deep` has vanished entirely. In a production incident that's the difference between fixing the bug in five minutes and staring at the wrong file for an hour. The rule is absolute: **inside a catch, use bare `throw;` to re-throw.** The compiler agrees — building the `throw ex;` version emits analyzer warning **CA2200: *Re-throwing caught exception changes stack information.***"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Why does throw ex; even exist?",
      "text": "Because `throw ex;` is just the normal 'throw this object' syntax, and `ex` happens to be an exception you're holding. The compiler can't forbid it — sometimes you really do want to throw a *different* exception you built. The danger is only when `ex` is the very exception you just caught. Train your eyes: a bare `throw;` inside `catch` is almost always right; `throw ex;` of the *caught* variable is almost always a mistake."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Adding context: wrap with an inner exception",
      "id": "wrapping"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes a low-level exception is *technically accurate but useless to the caller*. A `FileNotFoundException` bubbling out of your configuration loader tells the web layer nothing about *what operation* failed. The professional move is to **catch the low-level exception and throw a higher-level one that explains the business operation — while preserving the original as `InnerException`.** This is exactly Python's `raise NewError(...) from original`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static void LoadConfig()\n{\n    try\n    {\n        throw new FileNotFoundException(\"Could not find file 'app.config'.\");\n    }\n    catch (FileNotFoundException ex)\n    {\n        // Wrap: add business context, keep the original as the cause.\n        throw new ConfigException(\"Failed to load application configuration.\", ex);\n    }\n}\n\ntry\n{\n    LoadConfig();\n}\ncatch (ConfigException ex)\n{\n    Console.WriteLine($\"Outer : {ex.Message}\");\n    Console.WriteLine($\"Inner : {ex.InnerException?.Message}\");\n}\n\n// Custom exception (covered in the next lesson). The second constructor\n// argument becomes InnerException.\nclass ConfigException : Exception\n{\n    public ConfigException(string message, Exception inner) : base(message, inner) { }\n}"
    },
    {
      "kind": "output",
      "output": "Outer : Failed to load application configuration.\nInner : Could not find file 'app.config'.",
      "label": "Program output"
    },
    {
      "kind": "paragraph",
      "text": "The caller now catches a meaningful `ConfigException` (your domain language), yet the root cause is one `.InnerException` away — and the full inner stack trace travels along with it, so nothing is lost. This is the canonical way to stop infrastructure details (`SqlException`, `HttpRequestException`) from leaking across layer boundaries: catch them at the edge of your data or HTTP layer and re-throw as an `OrderProcessingException`, `PaymentException`, etc., with the original wrapped inside."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Three ways to send an exception onward — pick by intent",
      "text": "**`throw;`** — same exception, same trace: 'I touched it but it's not mine to fix.' **`throw new X(\"context\", ex);`** — new, more meaningful exception with the cause preserved: 'I'm translating this for the next layer.' **`ExceptionDispatchInfo.Capture(ex).Throw();`** (from `System.Runtime.ExceptionServices`) — re-throw an exception you stored *earlier or on another thread*, preserving its original trace from *outside* a catch block. Never use `throw ex;` to re-throw the one you just caught."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When to let it propagate (and not catch at all)",
      "id": "when-to-propagate"
    },
    {
      "kind": "paragraph",
      "text": "Beginners often feel they must wrap everything in try/catch. The opposite is true: **only catch an exception if you can actually do something useful with it** — recover, retry, translate, or finally handle it at a boundary. If all your catch does is re-throw, delete it; let the exception flow to someone who *can* act. A great real-world tool here is the **exception filter** (`when`), which lets you catch *conditionally* and let everything else propagate untouched."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static void Demo(int code)\n{\n    try\n    {\n        RunQuery(code);\n    }\n    catch (DataAccessException ex) when (ex.Number == 1205)  // deadlock only\n    {\n        Console.WriteLine($\"Caught deadlock ({ex.Number}); will retry.\");\n    }\n    // Any OTHER error code is NOT caught here — it propagates to the caller.\n}\n\n// Stand-in for a real database call that fails with a SQL error number.\nstatic void RunQuery(int code) => throw new DataAccessException(code);\n\nDemo(1205);                       // handled locally\n\ntry { Demo(547); }                // 547 = constraint violation, not ours to handle\ncatch (DataAccessException ex)\n{\n    Console.WriteLine($\"Propagated to caller: error {ex.Number}.\");\n}\n\nclass DataAccessException : Exception\n{\n    public int Number { get; }\n    public DataAccessException(int number) => Number = number;\n}",
      "filename": "Filters.cs"
    },
    {
      "kind": "output",
      "output": "Caught deadlock (1205); will retry.\nPropagated to caller: error 547.",
      "label": "Program output"
    },
    {
      "kind": "paragraph",
      "text": "The `when` filter means we *only* intercept the transient deadlock (SQL error 1205) that we know how to retry; the constraint violation (547) sails straight past to a caller who understands it. This is precisely how resilience libraries like [Polly](https://github.com/App-vNext/Polly) decide what to retry. Keep filter expressions **side-effect free** — read immutable state only, because the runtime may evaluate them more than once and at surprising times. And remember: a thrown exception is a promise that the operation didn't half-finish. If your method mutates several things and throws midway, restore the invariants (roll back) so callers can assume *no* side effects occurred."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "C# has no checked exceptions",
      "text": "Unlike Java, C# never forces a method to declare or catch what it might throw — the compiler stays silent. That freedom puts the discipline on *you*: throw precise types, write clear messages, and document the exceptions your public methods can raise (XML `<exception>` tags) so callers aren't ambushed."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Throw to **signal failure** the moment your method can't keep its promise — don't return a wrong answer or limp on silently.",
        "Pick the **most specific built-in type** (`ArgumentException` family, `InvalidOperationException`, …); never throw reserved types like `NullReferenceException` or the bare `Exception` (CA2201).",
        "Write **guard clauses** with `ArgumentNullException.ThrowIfNull`, `ArgumentException.ThrowIfNullOrWhiteSpace`, and the `ArgumentOutOfRangeException.ThrowIf*` family — and never pass `nameof()` to them; `[CallerArgumentExpression]` captures the name for you.",
        "Inside a catch, **`throw;` preserves the original stack trace**; **`throw ex;` resets it** to the re-throw line and hides the real origin (CA2200). Always use bare `throw;`.",
        "To add context across layers, **`throw new MyException(\"...\", ex)`** so the original travels along as `InnerException`.",
        "**Only catch what you can handle.** Use `when` filters to catch conditionally and let everything else propagate; if a catch only re-throws, remove it."
      ]
    }
  ]
};
