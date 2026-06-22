import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "try-catch",
  "number": 1,
  "title": "try / catch — The Basics",
  "objective": "Catch and handle exceptions, understand how they propagate up the call stack, which catch block wins, and how to read a stack trace.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every program eventually meets reality: a file that isn't there, a user who types `\"banana\"` into a number field, a network that blinks out mid-request. **Exceptions** are C#'s way of saying *\"I cannot continue normally — someone deal with this,\"* and `try`/`catch` is how you decide who does."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Lean hard on the Python bridge early — almost every student here has written `try/except`, so the conceptual leap is small. The friction is all in the *details* (catch by type, no `else`, ordering rules).",
        "Run the very first uncaught-exception demo live if you can. Seeing the red stack trace in the terminal — and then *reading* it — is the single most valuable five minutes of this lesson.",
        "Resist teaching `finally`, `using`, custom exceptions, or `throw` here. This lesson is deliberately scoped to catching and reading. Those each get their own lesson; forward-reference them but don't dive.",
        "The 'when NOT to catch' section is the one students under-value and seniors over-value. Spend real time on it — swallowed exceptions are a career-long source of production pain.",
        "Common live-coding mistake to provoke on purpose: put `catch (Exception)` first, watch the compiler reject the more specific catch below it. The compile error (CS0160) teaches ordering better than any slide.",
        "Watch for a sharp student snagging on the `Divide` demo: it *returns* `decimal` yet throws `DivideByZeroException`. The reason is that `a / b` is **integer** division (both operands are `int`) and runs *before* any widening to `decimal`, so the zero divide happens first. Mention it if asked; don't derail the whole class on it."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What is an exception?",
      "id": "what-is-an-exception"
    },
    {
      "kind": "paragraph",
      "text": "An **exception** is an object — an instance of `System.Exception` or one of its many subclasses — that represents an error or an unexpected condition. When something goes wrong, C# *throws* one: it stops the current line of execution and starts hunting for code that's willing to *catch* it. If nobody catches it, the program crashes and prints a diagnostic. This is the same idea as Python's `raise`/`except`, and if you've written `try:` / `except ValueError as e:` you already understand 80% of what follows."
    },
    {
      "kind": "paragraph",
      "text": "The one mental-model shift to make up front: **C# catches by *type*, not by name.** In Python you might `except ValueError`. In C# you write `catch (FormatException ex)` — you're saying *\"I'll handle any exception whose type is `FormatException` (or derives from it),\"* and `ex` is the caught object. Because every exception derives from `System.Exception`, catching `Exception` catches *everything*, which is exactly the power you must learn to use sparingly."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// Top-level statements — no Main() boilerplate needed in .NET 10.\nint[] scores = { 90, 75, 88 };\n\n// This line asks for an element that doesn't exist (valid indexes are 0..2).\nConsole.WriteLine(scores[10]);\n\nConsole.WriteLine(\"This line never runs.\");"
    },
    {
      "kind": "output",
      "label": "Uncaught — the program crashes",
      "output": "Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.\n   at Program.<Main>$(String[] args) in /app/Program.cs:line 5"
    },
    {
      "kind": "paragraph",
      "text": "Notice what the runtime told us: the **type** (`System.IndexOutOfRangeException`), a human-readable **message** (\"Index was outside the bounds of the array.\"), and a **stack trace** — the trail of where it happened (`Program.cs:line 5`). Those three pieces are properties on the exception object, and learning to read them is half of debugging. The other half is deciding whether to catch this at all."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "try / catch — the basic syntax",
      "id": "try-catch-syntax"
    },
    {
      "kind": "paragraph",
      "text": "Wrap the risky code in a `try` block and follow it with one or more `catch` blocks. If a statement inside `try` throws, C# *immediately* abandons the rest of the `try` and jumps to the first `catch` whose type matches. Here's the canonical real-world example: parsing untrusted input. A user types something into a web form, and we cannot trust it to be a number."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "Console.Write(\"Enter your age: \");\nstring? input = Console.ReadLine();\n\ntry\n{\n    int age = int.Parse(input!);          // throws FormatException on \"banana\"\n    Console.WriteLine($\"Next year you'll be {age + 1}.\");\n}\ncatch (FormatException ex)\n{\n    Console.WriteLine(\"That wasn't a whole number.\");\n    Console.WriteLine($\"(details: {ex.Message})\");\n}\n\nConsole.WriteLine(\"Thanks for using the app.\");"
    },
    {
      "kind": "output",
      "label": "When the user types: banana",
      "output": "Enter your age: banana\nThat wasn't a whole number.\n(details: The input string 'banana' was not in a correct format.)\nThanks for using the app."
    },
    {
      "kind": "paragraph",
      "text": "Because we *handled* the exception, the program didn't crash — the line `int age = ...` was abandoned, the `catch` ran, and then execution continued normally past the whole `try`/`catch` to print the closing line. Compare the shapes side by side; they map almost one-to-one, but the differences are worth memorizing."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python",
          "items": [
            "`try:` / `except ValueError as e:`",
            "Catches by the exception's **name** in scope",
            "Has an `else:` clause that runs if no exception",
            "`except (A, B):` catches multiple types in one clause",
            "Bare `except:` catches everything"
          ]
        },
        {
          "title": "C#",
          "items": [
            "`try { }` / `catch (FormatException ex) { }`",
            "Catches by the exception's **type** (and its subtypes)",
            "**No `else`** — put 'success' code at the end of `try`, or after it",
            "**No multi-type clause** — use separate `catch` blocks (or a `when` filter, a later lesson)",
            "`catch { }` or `catch (Exception)` catches everything"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "There is no `else` on a C# try",
      "text": "Python developers reach for a `try/except/else` shape out of habit. C# has no `else` clause. If you want code that runs *only when the `try` succeeded*, put it at the **bottom of the `try` block** (so it's skipped on a throw) or simply *after* the whole `try`/`catch` if it should run regardless. Don't go looking for an `else` keyword here — it won't compile."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The exception object: Message and StackTrace",
      "id": "the-exception-object"
    },
    {
      "kind": "paragraph",
      "text": "The variable you bind in `catch (SomeException ex)` is a real object with useful properties. The two you'll use constantly are **`Message`** (a human-readable description, usually ending in a period) and **`StackTrace`** (the call path showing where the throw originated). There's also `InnerException` (a wrapped underlying cause — covered when we discuss rethrowing) and `GetType().Name` (the exact type, handy for logging)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "static decimal Divide(int a, int b) => a / b;   // a / b is INTEGER division -> throws on b == 0\n\ntry\n{\n    var result = Divide(10, 0);\n    Console.WriteLine(result);\n}\ncatch (DivideByZeroException ex)\n{\n    Console.WriteLine($\"Type:    {ex.GetType().Name}\");\n    Console.WriteLine($\"Message: {ex.Message}\");\n    Console.WriteLine(\"Stack trace:\");\n    Console.WriteLine(ex.StackTrace);\n}"
    },
    {
      "kind": "output",
      "output": "Type:    DivideByZeroException\nMessage: Attempted to divide by zero.\nStack trace:\n   at Program.<<Main>$>g__Divide|0_0(Int32 a, Int32 b) in /app/Program.cs:line 1\n   at Program.<Main>$(String[] args) in /app/Program.cs:line 5"
    },
    {
      "kind": "paragraph",
      "text": "Read the two `at` lines as a path: the throw happened *inside* `Divide` (line 1), which was *called from* the top-level code (line 5, the `var result = Divide(10, 0);` line). The `<<Main>$>g__Divide|0_0` mangling is just how the compiler names a **local function** declared inside top-level statements — it looks alien, but the `Divide` in the middle is the part you care about."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Logging tip you'll use forever",
      "text": "In real code, don't hand-print `Message` and `StackTrace` separately. Just log the **whole exception object** — `logger.LogError(ex, \"Failed to charge customer {Id}\", id)`, or even `Console.WriteLine(ex)`. C#'s `Exception.ToString()` already formats the type, message, *and* full stack trace (including inner exceptions). Logging the message alone throws away the most valuable debugging information you have."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "How exceptions propagate up the call stack",
      "id": "propagation"
    },
    {
      "kind": "paragraph",
      "text": "Here's the part that surprises beginners: a `try`/`catch` does **not** have to sit next to the risky line. When a method throws and *doesn't* catch the exception itself, the exception **propagates** — it pops out of that method to whoever called it, then to *that* method's caller, and so on up the call stack, until it finds a matching `catch` or reaches the top and crashes the program. This is exactly Python's behavior, and it's what makes centralized error handling possible: low-level code throws, and a single handler way up high catches."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// A tiny three-layer 'business app': controller -> service -> repository.\n\nLoadDashboard();   // top-level call\n\nvoid LoadDashboard()            // layer 1 (caller)\n{\n    try\n    {\n        var user = GetUser(42);\n        Console.WriteLine($\"Welcome, {user}!\");\n    }\n    catch (InvalidOperationException ex)   // caught HERE, two layers up\n    {\n        Console.WriteLine($\"Could not load dashboard: {ex.Message}\");\n    }\n}\n\nstring GetUser(int id)          // layer 2 — no try/catch; just lets it fly\n{\n    return QueryDatabase(id);\n}\n\nstring QueryDatabase(int id)    // layer 3 — the throw originates here\n{\n    throw new InvalidOperationException($\"No user with id {id}.\");\n}"
    },
    {
      "kind": "output",
      "output": "Could not load dashboard: No user with id 42."
    },
    {
      "kind": "paragraph",
      "text": "`QueryDatabase` threw, `GetUser` had no handler so the exception sailed right through it, and `LoadDashboard` caught it. This is the everyday architecture of a backend: a repository deep in the stack throws, and you catch it once at a sensible boundary — not in every method along the way. In ASP.NET Core web APIs this is taken to its logical conclusion with a single global handler (`IExceptionHandler` + `UseExceptionHandler`) that turns any uncaught exception into a clean HTTP error response, so individual controllers stay free of `try`/`catch` clutter. We'll build that later; for now, just internalize that **the catch can be far from the throw.**"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Specific types vs. catching Exception",
      "id": "specific-vs-broad"
    },
    {
      "kind": "paragraph",
      "text": "Because every exception derives from `System.Exception`, `catch (Exception ex)` is the catch-all — the C# equivalent of Python's bare `except:`. It's tempting, and it's usually wrong. **Catch the most specific type you can actually do something about.** Catching `FileNotFoundException` says \"I know how to recover from a missing file.\" Catching `Exception` says \"I'll swallow *anything*\" — including bugs you didn't anticipate, like a `NullReferenceException` from your own broken code, or an `OutOfMemoryException` you have no business handling."
    },
    {
      "kind": "examples",
      "intro": "Same goal — load a config file — at three levels of precision. The middle one is the sweet spot.",
      "examples": [
        {
          "label": "Too broad — hides bugs",
          "code": "try\n{\n    var text = File.ReadAllText(\"config.json\");\n    return Parse(text);\n}\ncatch (Exception)            // swallows EVERYTHING, even your own bugs\n{\n    return DefaultConfig();\n}"
        },
        {
          "label": "Just right — handle what you expect",
          "code": "try\n{\n    var text = File.ReadAllText(\"config.json\");\n    return Parse(text);\n}\ncatch (FileNotFoundException)   // a real, expected, recoverable case\n{\n    return DefaultConfig();      // sensible fallback\n}"
        },
        {
          "label": "Precise + still resilient",
          "code": "try\n{\n    var text = File.ReadAllText(\"config.json\");\n    return Parse(text);\n}\ncatch (FileNotFoundException)\n{\n    return DefaultConfig();      // missing file -> defaults\n}\ncatch (JsonException ex)        // System.Text.Json\n{\n    // file exists but is corrupt -> a different, deliberate response\n    throw new InvalidOperationException(\"config.json is malformed.\", ex);\n}"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Multiple catch blocks and ordering",
      "id": "multiple-catch-ordering"
    },
    {
      "kind": "paragraph",
      "text": "A single `try` can have several `catch` blocks. C# checks them **top to bottom** and runs the **first** one whose type matches — only one catch ever runs. Because matching includes subtypes, the rule is iron-clad: **order from most-specific to least-specific (`Exception` last).** Put a base type before a more-derived one and the derived `catch` becomes unreachable — and unlike many mistakes, the C# compiler *refuses to build it.*"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "try\n{\n    var raw = File.ReadAllText(path);\n    var record = int.Parse(raw);\n    Process(record);\n}\ncatch (FileNotFoundException)              // most specific\n{\n    Console.WriteLine(\"File is missing — using defaults.\");\n}\ncatch (FormatException)                    // also specific, sibling type\n{\n    Console.WriteLine(\"File contents weren't a valid number.\");\n}\ncatch (IOException ex)                      // broader: parent of many I/O errors\n{\n    Console.WriteLine($\"An I/O problem occurred: {ex.Message}\");\n}\ncatch (Exception ex)                        // last-resort fallback\n{\n    Console.WriteLine($\"Unexpected error: {ex.Message}\");\n}"
    },
    {
      "kind": "paragraph",
      "text": "One subtle point worth knowing: `FileNotFoundException` actually *derives from* `IOException`, so its block has to come before the `IOException` block — which it does. `FormatException`, by contrast, is unrelated to I/O; it's a sibling under `Exception`, so its position relative to `IOException` doesn't matter for correctness. When in doubt, ordering most-specific-first is always safe."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Wrong order is a compile error, not a runtime surprise",
      "text": "If you write `catch (Exception)` *above* `catch (IOException)`, the compiler rejects it with error **CS0160: \"A previous catch clause already catches all exceptions of this or of a super type ('Exception').\"** Every `IOException` would already be swallowed by the `Exception` catch, so the second block can never run. C# treats this dead code as an error. The fix is always the same: move the most-derived types up, base types down."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: catch narrowly, and only what you can handle",
      "text": "The professional default is **don't catch unless you have a concrete recovery plan** — a fallback value, a retry, a friendlier message, or a meaningful wrap-and-rethrow. If all your `catch` does is log and rethrow, let it propagate to a single boundary handler instead (that's the ASP.NET Core pattern). And on hot paths for *expected* failures — parsing user input, dictionary lookups — skip exceptions entirely and use the `Try*` methods like `int.TryParse(s, out var n)` and `dict.TryGetValue(key, out var v)`. Exceptions in .NET are relatively expensive (throwing one captures a stack trace), so reserve them for the genuinely exceptional."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python's EAFP habit doesn't fully transfer",
      "text": "Python culture leans on \"easier to ask forgiveness than permission\" — wrap it in `try/except` and catch the failure. C# leans the other way for *expected* conditions: check first, or use a `Try*` method, and save exceptions for the truly unexpected. It's not that exceptions are bad — it's that throwing one to handle a routine bad-input case is both slower and less clear than `if (int.TryParse(...))`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When NOT to catch",
      "id": "when-not-to-catch"
    },
    {
      "kind": "paragraph",
      "text": "The most damaging exception-handling code is the code that catches something it shouldn't. The cardinal sin is the **swallowed exception** — an empty `catch` block that makes a real failure vanish silently. The program limps onward in a broken state, the bug surfaces somewhere else entirely (or as wrong data in your database), and the actual cause is gone forever. This is the single hardest class of bug to diagnose in production, and it's almost always self-inflicted."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// NEVER do this. The error is gone; nobody will ever know it happened.\ntry\n{\n    ChargeCustomer(order);\n}\ncatch (Exception)\n{\n    // ...silence. The charge may have failed and we just shipped the order.\n}"
    },
    {
      "kind": "list",
      "items": [
        "**Don't swallow.** An empty `catch`, or one that only logs and then continues as if nothing happened, hides bugs. If you truly cannot handle it, don't catch it.",
        "**Don't catch `Exception` just to be 'safe.'** You'll accidentally catch your own `NullReferenceException` bugs, cancellation signals, and out-of-memory conditions you can't recover from anyway.",
        "**Don't use exceptions for normal control flow.** Reaching for `catch (FormatException)` to detect non-numeric input is a habit to drop — use `int.TryParse`. Exceptions are for the *exceptional*.",
        "**Don't catch what you can't fix.** If there's no fallback, retry, or added context you can provide, letting it propagate to a higher handler is the *correct* and professional choice — not a failure on your part."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Reading a stack trace",
      "id": "reading-a-stack-trace"
    },
    {
      "kind": "paragraph",
      "text": "When an exception goes uncaught, the runtime prints a stack trace — your map back to the crime scene. Read it from the **top down**: the first line names the exception type and message, and each `at ...` line below it is a stack frame, *innermost (where the throw happened) first*, walking outward to the entry point. The frame with *your* code and a `:line N` is almost always where you want to start looking."
    },
    {
      "kind": "output",
      "label": "A real uncaught crash",
      "output": "Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.\n   at OrderService.CalculateTotal(Order order) in /app/Services/OrderService.cs:line 27\n   at CheckoutController.Submit(Int32 orderId) in /app/Controllers/CheckoutController.cs:line 54\n   at Program.<Main>$(String[] args) in /app/Program.cs:line 12"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Line 1 — what & why:** `System.NullReferenceException: Object reference not set...` — the type tells you the *category* of failure (here, you used something that was `null`).",
        "**Top frame — where it actually threw:** `OrderService.CalculateTotal ... line 27`. Open that file, go to line 27 — *this is where to start debugging.* Something on that line was `null`.",
        "**Middle frames — how you got there:** `CheckoutController.Submit ... line 54` called `CalculateTotal`. This is the call chain; useful for understanding the context that led to the bad value.",
        "**Bottom frame — the entry point:** `Program.<Main>$` is the program's start. Everything between top and bottom is the path the exception travelled while propagating up."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "The fastest debugging instinct you can build",
      "text": "Don't be intimidated by a wall of `at ...` lines. Train one reflex: **read the first line for the type, then find the topmost frame that points at *your* code and a line number.** Nine times out of ten, that exact line is where the bug lives. The frames below it are just the road that got you there."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "An **exception** is an object (`System.Exception` or a subclass). C# catches **by type**, not by name — `catch (FormatException ex)` is like Python's `except ValueError as ex`.",
        "`try { ... } catch (T ex) { ... }`: if the `try` throws, the rest of it is abandoned and the first matching `catch` runs, then execution continues past the whole block. C# has **no `else`** clause.",
        "The exception object carries **`Message`** (human-readable) and **`StackTrace`** (where it came from). When logging, log the **whole exception** — `ex.ToString()` includes type, message, and full trace.",
        "Uncaught exceptions **propagate up the call stack** through every method until something catches them or the program crashes — so the `catch` can live far from the `throw`.",
        "Catch the **most specific** type you can actually recover from; reserve `catch (Exception)` for genuine last-resort fallback. Catching too broadly hides your own bugs.",
        "Order `catch` blocks **most-specific to least-specific (`Exception` last)** — a base type before a derived one is a **compile error** (CS0160, unreachable catch).",
        "**Don't catch what you can't handle.** Empty/silent catches (swallowing) are the worst bug class in production. For *expected* failures on hot paths, use `Try*` methods like `int.TryParse` instead of exceptions.",
        "**Read a stack trace top-down:** line 1 = type + message; the topmost frame pointing at your code and a `:line N` is where the bug almost always lives."
      ]
    }
  ]
};
