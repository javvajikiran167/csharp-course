import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "best-practices",
  "number": 5,
  "title": "Exception Best Practices",
  "objective": "Apply production-grade exception practices: catch only what you can handle, never swallow, use exception filters, and prefer the Try-pattern for expected failures.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Anyone can wrap code in `try`/`catch` — but the difference between a hobby project and production software is *how* you handle the failure once you've caught it."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This lesson is the payoff for everything before it: students now know the syntax, so spend your energy on judgement, not mechanics. The recurring question to ask out loud is **\"and then what?\"** — once you catch, what do you actually *do*?",
        "The single highest-value takeaway is **\"never swallow.\"** If a student leaves remembering only one thing, make it the empty-catch anti-pattern. Show the silent-failure demo live; it lands hard.",
        "For Python folks, explicitly name the EAFP-vs-LBYL tension. Python culture says \"ask forgiveness\"; .NET performance culture says \"look before you leap on hot paths.\" This is a genuine cultural shift, not just a syntax change.",
        "The Try-pattern (`int.TryParse`, `Dictionary.TryGetValue`) is the concrete tool that resolves that tension. Make sure they can write a `TryParse` call from memory by the end.",
        "Keep the ASP.NET Core middleware section as a *preview* — say plainly \"you'll build this for real in the web module.\" The goal is to show that real apps centralize handling, not to teach middleware now.",
        "If you have a code analyzer running live (it ships on by default in .NET 10), show CA2200 lighting up on `throw ex;`. Seeing the IDE flag it is more memorable than any slide.",
        "Heads-up on the demos: the `:C` currency format follows the machine's culture, so a default install may print `₹` or `€` instead of `$`. The runnable snippets pin `CultureInfo.CurrentCulture` to `en-US` so the dollar output is reproducible — mention this if a student's machine prints a different symbol; it's a feature of `:C`, not a bug."
      ]
    },
    {
      "kind": "paragraph",
      "text": "By now you can write `try`/`catch`/`finally`, throw exceptions, and create your own exception types. That's the grammar. This lesson is about the *taste* — the hard-won judgement that separates code that fails gracefully from code that fails silently and ruins someone's Tuesday. Every rule here came from a real outage somewhere. We'll go through them the way a senior engineer reviews a pull request: not \"does it compile?\" but \"what happens when this *breaks*?\""
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Exceptions are for the exceptional — not for control flow",
      "id": "exceptional-not-control-flow"
    },
    {
      "kind": "paragraph",
      "text": "Here's the first cultural adjustment coming from Python. Python's community embraces **EAFP** — \"Easier to Ask Forgiveness than Permission.\" You just `try` the thing and catch the failure, because in Python that's idiomatic and cheap. In .NET, throwing an exception is genuinely *expensive*: the runtime walks the call stack to capture a stack trace, and that costs real microseconds — often hundreds to thousands of times more than a plain `if` check. So the .NET rule is blunt: **an exception should signal a condition the caller did not expect and generally cannot prevent.** A user typing `\"abc\"` into a number field is *not* exceptional — you expect bad input from users every single day. A database vanishing mid-transaction *is* exceptional."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ControlFlowSmell.cs",
      "code": "// ANTI-PATTERN: using an exception as a glorified 'if'.\n// This runs on every request in a web API parsing a query string.\nint ParseAgeBad(string raw)\n{\n    try\n    {\n        return int.Parse(raw);   // throws FormatException on \"abc\" — for EVERY bad input\n    }\n    catch (FormatException)\n    {\n        return 0;                // we EXPECTED this could fail, so why pay for a throw?\n    }\n}\n\n// BETTER: ask first. No exception is thrown for the common 'bad input' case.\nint ParseAgeGood(string raw)\n{\n    return int.TryParse(raw, out int age) ? age : 0;\n}"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: \"but Python does this all the time\"",
      "text": "It's true — `try: int(x) except ValueError:` is perfectly idiomatic Python. The instinct is correct *for Python*. In .NET, carrying that habit onto a hot path (a loop, a web request handler, a game's update loop) is a measurable performance bug. The rule of thumb: **if a failure happens routinely as part of normal operation, it isn't exceptional — handle it with an `if` or a `Try*` method, not a `catch`.**"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The cardinal sin: swallowing exceptions",
      "id": "never-swallow"
    },
    {
      "kind": "paragraph",
      "text": "Of all the mistakes in this lesson, this is the one that will cost you the most debugging hours over a career. An **empty catch block** — `catch { }` or `catch (Exception) { }` with nothing inside — tells the runtime \"something went wrong, and I'd like to pretend it didn't.\" The program keeps running as if all is well, the error vanishes without a trace, and three weeks later a customer reports that their orders aren't saving. There's no log, no stack trace, no clue. You've built a silent failure, which is the single hardest category of bug to diagnose."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Swallowing.cs",
      "code": "using System.Globalization;\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\");   // pin $ so :C output is reproducible\n\ndecimal balance = 100m;\n\n// THE CARDINAL SIN — the error disappears, the program lies to everyone.\ntry\n{\n    SaveOrderToDatabase(orderId: 42);   // imagine this throws: DB is down\n}\ncatch\n{\n    // ...nothing. The order was NOT saved, but we carry on as if it was.\n}\n\nConsole.WriteLine($\"Order placed! Balance: {balance:C}\");   // a confident lie\n\nstatic void SaveOrderToDatabase(int orderId) =>\n    throw new InvalidOperationException(\"Database connection failed.\");"
    },
    {
      "kind": "output",
      "label": "What the user sees — note the disaster is invisible",
      "output": "Order placed! Balance: $100.00"
    },
    {
      "kind": "paragraph",
      "text": "The order never saved, yet the customer got a cheerful confirmation. If you genuinely have nothing to do with an exception, the correct move is to **not catch it at all** and let it propagate to someone who can. The only time an empty-ish catch is defensible is when you are *deliberately and visibly* ignoring a specific, harmless failure — and even then you leave a comment explaining why, so the next reader knows it was a choice, not an accident."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Catch specific, then log, then handle or rethrow",
      "id": "catch-specific"
    },
    {
      "kind": "paragraph",
      "text": "When you *do* catch, follow three disciplines. **First, catch the most specific type you can.** `catch (Exception)` quietly scoops up everything — including `OutOfMemoryException`, cancellation, and your own `NullReferenceException` bugs — which you almost never meant to handle. Catch `FileNotFoundException` if that's the failure you understand. **Second, never lose the information.** Log the exception with context, or wrap it so the original survives. **Third, decide honestly: can I recover here, or am I just adding context on the way up?** If you can't recover, rethrow."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "RethrowProperly.cs",
      "code": "// A service layer reading a config file. It can't 'fix' a missing file,\n// but it CAN add domain context before the error travels up.\nstring LoadApiKey(string path)\n{\n    try\n    {\n        return File.ReadAllText(path).Trim();\n    }\n    catch (FileNotFoundException ex)\n    {\n        // Wrap: keep the original as InnerException, add a meaningful message.\n        throw new ConfigurationException($\"API key file '{path}' is missing.\", ex);\n    }\n}\n\n// Custom exception: derive from Exception, name ends in 'Exception',\n// provide the three standard constructors.\npublic sealed class ConfigurationException : Exception\n{\n    public ConfigurationException() { }\n    public ConfigurationException(string message) : base(message) { }\n    public ConfigurationException(string message, Exception inner) : base(message, inner) { }\n}"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "throw; — re-throw (do this)",
          "items": [
            "Bare `throw;` inside a `catch` re-throws the **same** exception.",
            "**Preserves the original stack trace** — you still see where the error truly began.",
            "Use it when you caught only to log or do partial cleanup, then want the error to keep travelling.",
            "Passes the CA2200 analyzer cleanly."
          ]
        },
        {
          "title": "throw ex; — reset (avoid this)",
          "items": [
            "`throw ex;` throws the same object but **resets the stack trace to this line**.",
            "You permanently lose where the error actually originated — debugging becomes a nightmare.",
            "The CA2200 analyzer flags it as a warning for exactly this reason.",
            "To *add context* instead, wrap: `throw new MyException(\"...\", ex)` keeps the original as `InnerException`."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: throw ex; looks harmless",
      "text": "`throw ex;` is one of the most frequent bugs in real codebases *and* a guaranteed interview question. It compiles, it runs, it even re-throws the right exception object — but it silently overwrites the stack trace with the current line, so the trace now points at your `catch` block instead of the real failure site. The fix is one character: drop the `ex`. Write `throw;`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Exception filters: catch when",
      "id": "exception-filters"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes you want to catch an exception only under a specific condition — say, a SQL deadlock (error code 1205) but not other SQL errors, or a transient HTTP failure but not a 404. C# gives you the `when` keyword to attach a boolean **filter** to a `catch`. If the filter is `false`, the `catch` doesn't fire and the exception keeps searching for a handler. This is genuinely better than catching, checking with an `if`, and re-throwing: the filter runs *before* the stack unwinds, so if no handler matches, the original stack trace and local variables are preserved perfectly for debugging."
    },
    {
      "kind": "examples",
      "intro": "Three real-world filter patterns you'll see in production code (illustrative fragments — `SqlException`, `logger`, and the async methods come from the surrounding app):",
      "examples": [
        {
          "label": "Handle a specific SQL error code, ignore the rest",
          "code": "try\n{\n    await SaveChangesAsync();\n}\ncatch (SqlException ex) when (ex.Number == 1205)   // 1205 = deadlock victim\n{\n    // Only deadlocks reach here — retry the transaction.\n    await RetryAsync();\n}"
        },
        {
          "label": "Match several types in one block (no Python 'except (A, B)' needed)",
          "code": "try\n{\n    await CallPartnerApiAsync();\n}\ncatch (Exception ex) when (ex is HttpRequestException or TimeoutException)\n{\n    logger.LogWarning(ex, \"Transient network failure; will retry.\");\n}"
        },
        {
          "label": "Log everything as it flies past, but DON'T actually catch it",
          "code": "try\n{\n    Process();\n}\ncatch (Exception ex) when (LogAndContinue(ex))   // filter returns false\n{\n    // unreachable — the filter never returns true\n}\n// bool LogAndContinue(Exception e) { logger.LogError(e, \"seen\"); return false; }"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: keep filters side-effect free",
      "text": "A `when (...)` filter should only *read* immutable state to make a yes/no decision — never mutate anything inside it. Filters can run at surprising times and (in nested scenarios) more than once, so side effects there cause baffling bugs. The one widely-accepted exception is the logging trick above, where the filter logs and deliberately returns `false` to peek at every exception without swallowing it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Try-pattern: the right tool for expected failures",
      "id": "try-pattern"
    },
    {
      "kind": "paragraph",
      "text": "We've said \"don't use exceptions for expected failures\" — so what *do* you use? The .NET BCL gives you the **Try-pattern**: a method named `TryX` that returns a `bool` for success and hands back the result through an `out` parameter, throwing nothing. `int.TryParse`, `Dictionary.TryGetValue`, `Guid.TryParse`, `DateTime.TryParse` — these all exist precisely so the common \"it might legitimately not work\" case costs you a cheap boolean instead of an expensive throw. For Python folks: think of `dict.get(key, default)` versus `dict[key]` raising `KeyError`. `TryGetValue` is the `.get()` of the C# world."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Globalization;\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\");   // pin $ so :C output is reproducible\n\n// Parsing user input — failure is EXPECTED, so no exceptions in sight.\nstring[] inputs = [\"42\", \"hello\", \"-7\", \"\"];\n\nforeach (string raw in inputs)\n{\n    if (int.TryParse(raw, out int value))\n        Console.WriteLine($\"'{raw}' -> {value}\");\n    else\n        Console.WriteLine($\"'{raw}' -> not a valid integer\");\n}\n\n// Dictionary lookup — the C# equivalent of Python's dict.get(...)\nvar prices = new Dictionary<string, decimal> { [\"coffee\"] = 3.50m, [\"tea\"] = 2.75m };\n\nif (prices.TryGetValue(\"coffee\", out decimal price))\n    Console.WriteLine($\"Coffee costs {price:C}\");\n\nif (!prices.TryGetValue(\"juice\", out _))   // discard the out value with _\n    Console.WriteLine(\"Juice isn't on the menu.\");"
    },
    {
      "kind": "output",
      "output": "'42' -> 42\n'hello' -> not a valid integer\n'-7' -> -7\n'' -> not a valid integer\nCoffee costs $3.50\nJuice isn't on the menu."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: match the tool to the likelihood",
      "text": "A quick decision rule for production code: if a failure is **routine and expected** (parsing user input, looking up a maybe-missing key), reach for a `Try*` method or an `if`-guard. If a failure is **genuinely exceptional** (the disk is full, a dependency is down, an invariant is violated), throw or let an exception propagate. Choosing the right one keeps your hot paths fast *and* your error handling honest."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The real cost of throwing",
      "id": "cost-of-exceptions"
    },
    {
      "kind": "paragraph",
      "text": "Why all this insistence on not over-using exceptions? Because throwing one is not free. When you `throw`, the runtime captures the current call stack so the trace can tell you where things went wrong — and capturing and then unwinding that stack is *orders of magnitude* slower than returning a value. A single throw is negligible. A throw inside a loop that runs ten thousand times per web request is a performance incident. This is the engineering reason behind \"exceptions are for the exceptional\": correctness *and* speed point the same direction. Reserve the expensive mechanism for the cases that actually warrant it, and use cheap checks for everything you can see coming."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "How real apps handle this: a middleware preview",
      "id": "global-handling"
    },
    {
      "kind": "paragraph",
      "text": "If catching, logging, and mapping exceptions is so important, surely a large web API does it in every single endpoint? No — and that's the final lesson. Repeating `try`/`catch` in hundreds of controller actions is noise and a maintenance trap. Instead, modern ASP.NET Core apps **centralize** exception handling at the boundary. You register one `IExceptionHandler` with `AddExceptionHandler` and `UseExceptionHandler`, and it catches anything that escapes your business logic, logs it once with full context, and converts it into a clean **ProblemDetails** HTTP response (the RFC 9457 standard error shape). Your individual handlers stay focused on the happy path."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "GlobalExceptionHandler.cs",
      "code": "// PREVIEW — you'll build this for real in the web module. Skim the shape for now.\npublic sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)\n    : IExceptionHandler\n{\n    public async ValueTask<bool> TryHandleAsync(\n        HttpContext context, Exception ex, CancellationToken ct)\n    {\n        // Log ONCE, here at the boundary — not at every layer on the way up.\n        logger.LogError(ex, \"Unhandled exception on {Path}\", context.Request.Path);\n\n        // Map a domain exception to the right HTTP status; default to 500.\n        int status = ex is ConfigurationException\n            ? StatusCodes.Status400BadRequest\n            : StatusCodes.Status500InternalServerError;\n\n        context.Response.StatusCode = status;\n        await context.Response.WriteAsJsonAsync(\n            new ProblemDetails { Status = status, Title = \"An error occurred.\" }, ct);\n\n        return true;   // we handled it; the framework stops looking for another handler\n    }\n}\n\n// In Program.cs:\n//   builder.Services.AddExceptionHandler<GlobalExceptionHandler>();\n//   app.UseExceptionHandler();"
    },
    {
      "kind": "paragraph",
      "text": "Notice how this ties the whole lesson together. The handler **catches at the boundary** (where it can actually do something useful — return a response), it **logs once** instead of producing duplicate noise at every layer, it **maps specific** domain exceptions to specific outcomes, and it lets your deep business code throw freely without drowning in `try`/`catch`. That's the production shape: throw meaningful exceptions where problems occur, and handle them in exactly one well-chosen place."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "The same idea outside the web",
      "text": "Not building a web API? The principle still holds. A desktop or console app uses `AppDomain.UnhandledException` and `TaskScheduler.UnobservedTaskException` as last-resort handlers; a background service catches at the top of its processing loop. Whatever the platform, the pattern is identical: **let exceptions propagate to a single, deliberate boundary, and handle them there.**"
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Exceptions are for the exceptional.** Throwing is expensive (it captures and unwinds the stack), so don't use it for failures you expect routinely — that's a performance bug carried over from Python's EAFP style.",
        "**Never swallow.** An empty `catch { }` creates a silent failure — the worst kind of bug. If you can't do something useful with an exception, don't catch it; let it propagate.",
        "**Catch specific, log with context, then handle or rethrow.** Avoid a broad `catch (Exception)` unless it's a genuine top-level fallback.",
        "**Use `throw;` to re-throw, never `throw ex;`** — the latter resets the stack trace and hides the real origin (CA2200). To add context, wrap with `new MyException(\"...\", ex)` so the original survives as `InnerException`.",
        "**Exception filters (`catch ... when (...)`)** let you catch conditionally without unwinding the stack; keep them side-effect free.",
        "**Prefer the Try-pattern for expected failures** — `int.TryParse`, `Dictionary.TryGetValue`, and friends return a `bool` instead of throwing, like Python's `dict.get()`.",
        "**Real apps centralize handling at a boundary** — ASP.NET Core's `IExceptionHandler` + `UseExceptionHandler` logs once and returns a ProblemDetails response, instead of `try`/`catch` scattered everywhere."
      ]
    }
  ]
};
