import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "static",
  "number": 5,
  "title": "Static Members &amp; Static Classes",
  "objective": "Use static fields, methods, and classes for state and behavior that belong to the type rather than an instance — and know the tradeoffs.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Some things belong to **a thing**, and some things belong to **the kind of thing**. Your bank balance belongs to *your* account; the bank's interest rate belongs to *every* account at once. That single distinction — instance versus static — is what this lesson is about."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor the whole lesson on one sentence: **`static` means 'belongs to the type, not to any one object.'** Keep returning to it.",
        "Python students have met this informally: a value defined at class level and shared by all instances is the closest analog to a C# static field, and `@staticmethod` maps to a static method. But stress that in C# the compiler *enforces* the distinction — you literally cannot call a static method on an instance, or an instance method on the type. (In Python, by contrast, a class-level mutable like `[]` is a famous footgun precisely because the sharing is implicit; in C# you must opt into it with `static`.)",
        "Run the `Counter` example live and let the surprise land: every object sees the same `TotalCreated`. That 'aha' is the emotional core of the lesson.",
        "Spend real time on the **testability** section — it's the part juniors never get told and the part senior engineers care about most in code review. Static is not 'bad,' it's 'global,' and global state is the thing that makes tests flaky.",
        "`const` vs `static readonly` reliably trips people up: const is a compile-time copy-paste into call sites (and a binary-compat hazard across assemblies); static readonly is a single runtime value. Use the version-number anecdote.",
        "Two compiler errors are worth naming out loud so students recognize them later: **CS0176** ('cannot be accessed with an instance reference') when you do `a.TotalCreated`, and **CS0120** ('an object reference is required for the non-static member') when a static method reaches for instance state. Same idea, opposite directions.",
        "Don't drown them in the seven access modifiers here — that was the previous lesson. Keep the focus tight on static."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Instance vs static: who owns the data?",
      "id": "instance-vs-static"
    },
    {
      "kind": "paragraph",
      "text": "Every field you've written so far has been an **instance field**: each object gets its own private copy. Give `Account` a `Balance` field and a thousand accounts means a thousand independent balances. A **static** field flips that: there is exactly **one** copy, owned by the type itself, shared by every instance and reachable even when no instance exists. You write it with the `static` keyword, and you reach it through the *type name*, not through an object."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Counter.cs",
      "code": "public class Counter\n{\n    public static int TotalCreated = 0;  // ONE copy, shared by all instances\n    public int Id;                       // a separate copy per instance\n\n    public Counter()\n    {\n        TotalCreated++;        // mutates the single shared value\n        Id = TotalCreated;     // snapshots it into this object's own field\n    }\n}\n\nvar a = new Counter();\nvar b = new Counter();\nvar c = new Counter();\n\nConsole.WriteLine($\"a.Id = {a.Id}\");\nConsole.WriteLine($\"b.Id = {b.Id}\");\nConsole.WriteLine($\"c.Id = {c.Id}\");\nConsole.WriteLine($\"Counter.TotalCreated = {Counter.TotalCreated}\");"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "a.Id = 1\nb.Id = 2\nc.Id = 3\nCounter.TotalCreated = 3"
    },
    {
      "kind": "paragraph",
      "text": "Read the output carefully. Each object kept its *own* `Id` (1, 2, 3) because `Id` is an instance field. But there is only one `TotalCreated`, and all three constructors incremented that same counter, so it ended at 3 — and we asked for it through the type, `Counter.TotalCreated`, not through `a`, `b`, or `c`. That is the entire idea: **instance fields scale with the number of objects; static fields are a single global slot.** In a real ASP.NET Core service you'd reach for this pattern for a process-wide request counter, a cache of compiled regexes, or a feature-flag snapshot loaded once at startup. (For the public field here we're keeping the example minimal; in production you'd usually expose shared state through a property or, better, an injected service — more on why at the end of the lesson.)"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The mix-up that bites Python folks",
      "text": "In C# you **cannot** access a static member through an instance — `a.TotalCreated` is a compile error (**CS0176**, *'cannot be accessed with an instance reference; qualify it with a type name instead'*), not a warning. You must write `Counter.TotalCreated`. The reverse is also true: a `static` method cannot touch instance fields, because there's no `this` — there's no particular object for it to belong to. If the compiler says **CS0120**, *'an object reference is required for the non-static member'*, you've tried to use instance state from a static context."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Static methods and static classes",
      "id": "static-methods-and-classes"
    },
    {
      "kind": "paragraph",
      "text": "A **static method** is behavior that doesn't need an object to operate on — its answer depends only on its arguments, not on any instance's state. An **instance method** needs a `this`; a static method does not. Compare the two: `MathHelpers.Square(9)` works straight off the type, while `acc.Add(10)` needs a real `Accumulator` object to mutate."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Methods.cs",
      "code": "public static class MathHelpers\n{\n    public static int Square(int n) => n * n;   // pure function of its input\n}\n\npublic class Accumulator\n{\n    public int Total { get; private set; }\n    public void Add(int n) => Total += n;        // needs a 'this' to mutate\n}\n\nConsole.WriteLine(MathHelpers.Square(9));   // no object required\n\nvar acc = new Accumulator();\nacc.Add(10);\nacc.Add(5);\nConsole.WriteLine(acc.Total);"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "81\n15"
    },
    {
      "kind": "paragraph",
      "text": "When **every** member of a type is static — a bag of stateless helpers with nothing to instantiate — mark the whole type `static class`. A static class can't be instantiated (`new MathHelpers()` won't compile) and can't be inherited from, which is exactly what you want for a utility holder: it documents the intent and lets the compiler enforce it. The canonical example ships in the BCL: `System.Math`. You never write `new Math()` — you call `Math.Max`, `Math.Round`, `Math.Sqrt` directly off the type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "TemperatureConverter.cs",
      "code": "public static class TemperatureConverter\n{\n    public static double CelsiusToFahrenheit(double c) => c * 9 / 5 + 32;\n    public static double FahrenheitToCelsius(double f) => (f - 32) * 5 / 9;\n}\n\nConsole.WriteLine(TemperatureConverter.CelsiusToFahrenheit(100));\nConsole.WriteLine(TemperatureConverter.FahrenheitToCelsius(98.6));\nConsole.WriteLine(Math.Max(3, 7));        // the BCL's own static utility\nConsole.WriteLine(Math.Round(3.14159, 2));"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "212\n37\n7\n3.14"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python parallel",
      "text": "A C# `static class` of helpers is what a Python **module of free functions** gives you for free — `math.sqrt(x)`, `os.path.join(...)`. Python doesn't need a class wrapper because functions can live at module level; C# requires every method to live inside a type, so a `static class` is the idiomatic 'module' container. And a C# `static` method is the direct cousin of Python's `@staticmethod`."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Static constructors: run-once setup",
      "id": "static-constructors"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes that shared state needs real initialization logic, not just a literal. A **static constructor** runs **exactly once per type**, automatically, lazily, just before the type is first used (first static member access or first instance creation). It takes no parameters, has no access modifier, and you never call it yourself — the runtime does, and the runtime guarantees it runs once even if many threads race to touch the type at the same moment. It's the place to load a lookup table, read a config value, or compile a regex one time for the life of the process."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ExchangeRates.cs",
      "code": "public static class ExchangeRates\n{\n    private static readonly Dictionary<string, decimal> _rates;\n\n    // No modifier, no params, never called explicitly. Runs once, on first use.\n    static ExchangeRates()\n    {\n        Console.WriteLine(\"[static ctor] loading rates...\");\n        _rates = new()\n        {\n            [\"USD\"] = 1.00m,\n            [\"EUR\"] = 0.92m,\n            [\"INR\"] = 83.10m,\n        };\n    }\n\n    public static decimal Convert(decimal usd, string to) => usd * _rates[to];\n}\n\nConsole.WriteLine(\"program start\");\nConsole.WriteLine($\"100 USD = {ExchangeRates.Convert(100m, \\\"EUR\\\")} EUR\");\nConsole.WriteLine($\"100 USD = {ExchangeRates.Convert(100m, \\\"INR\\\")} INR\");"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "program start\n[static ctor] loading rates...\n100 USD = 92.00 EUR\n100 USD = 8310.00 INR"
    },
    {
      "kind": "paragraph",
      "text": "Notice the ordering: `\"program start\"` prints **before** the static constructor message. The type wasn't touched until the first `Convert` call, so its setup was deferred to that exact moment — and then never ran again for the second call. That laziness is a feature, but it's also a trap: if a static constructor throws, the type becomes permanently unusable for the rest of the process (you'll get a `TypeInitializationException` on every subsequent access, with the real error tucked inside its `InnerException`), and the *when* of that first touch can be hard to predict. Keep static constructors cheap and exception-free."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "const vs static readonly",
      "id": "const-vs-static-readonly"
    },
    {
      "kind": "paragraph",
      "text": "Both give you a value that never changes, but they are not the same mechanism. A **`const`** is a *compile-time* constant: its value must be known at compile time (literals only) and the compiler **copies that literal directly into every call site**. A **`static readonly`** field is a *runtime* constant: it's assigned once (at the declaration or in the static constructor), can use runtime values like `DateTime.UtcNow` or `Environment.MachineName`, and lives as a single field that callers read at runtime."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "AppConfig.cs",
      "code": "public static class AppConfig\n{\n    // Compile-time constant: must be a literal; baked into call sites.\n    public const string Version = \"2.4.0\";\n\n    // Runtime constants: computed once, may use runtime values.\n    public static readonly DateTime StartedAtUtc = DateTime.UtcNow;\n    public static readonly string MachineName = Environment.MachineName;\n}\n\nConsole.WriteLine($\"Version: {AppConfig.Version}\");\nConsole.WriteLine($\"Started (UTC year): {AppConfig.StartedAtUtc.Year}\");\n\n// const can be used where a compile-time value is REQUIRED:\nconst int MaxRetries = 3;   // attributes, switch labels, default params, array sizes\nConsole.WriteLine($\"MaxRetries: {MaxRetries}\");"
    },
    {
      "kind": "output",
      "label": "Output (year reflects when the program ran)",
      "output": "Version: 2.4.0\nStarted (UTC year): 2026\nMaxRetries: 3"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "const",
          "items": [
            "Value fixed **at compile time**; literals only.",
            "Implicitly `static` — no `static` keyword needed.",
            "**Inlined** into every call site (a copy-paste of the value).",
            "Usable where the language demands a constant: attribute args, `case` labels, default parameter values, enum bases.",
            "**Binary-compat hazard across assemblies:** if library A exposes `const` and you change it, every assembly that referenced it keeps the *old* inlined value until recompiled."
          ]
        },
        {
          "title": "static readonly",
          "items": [
            "Value set **once at runtime** (declaration or static ctor).",
            "Can use computed/runtime values, `new` objects, `DateTime.UtcNow`.",
            "Read through the single field — callers always see the current binary's value.",
            "**Cannot** be used in attributes, `case` labels, or default params.",
            "Safe across assembly boundaries — no inlining, so updating the library updates the value everywhere on next load."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: const for true universals, static readonly for everything else",
      "text": "Use `const` only for values that are genuinely fixed forever and that you need at compile time — mathematical facts, protocol magic numbers, an `enum`'s members. For **anything you ship across a library boundary** (version strings, default URLs, tunable limits), prefer `public static readonly` (or, better, configuration). It costs you the ability to use the value in an attribute, but it spares you the classic 'I changed the constant but the dependent DLL didn't notice' bug. Note that only the built-in primitives, `string`, and `enum` types can even be `const`; any other type (like `DateTime`) has to be `static readonly` anyway."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When static helps — and when it hurts",
      "id": "tradeoffs"
    },
    {
      "kind": "paragraph",
      "text": "Static is a sharp tool. It's perfect for **stateless, pure functions** (`Math.Max`, a `Slugify(string)` helper, a `TemperatureConverter`) — no instance to create, no state to corrupt, trivially thread-safe. It's also reasonable for **genuinely process-wide, read-mostly state** loaded once at startup. Where it turns dangerous is **mutable static state** and **hidden static dependencies**, because both are really *global variables* in disguise — and global state is the enemy of testability and concurrency."
    },
    {
      "kind": "paragraph",
      "text": "Here's the testability problem made concrete. A discount that reads `DateTime.Now` directly has a **hidden static dependency** on the real system clock. How do you unit-test the Friday discount? You can't reliably — you'd have to wait until Friday, and your test would pass or fail depending on the calendar. The fix isn't to abandon static; it's to push the static call behind an **injected abstraction** so a test can supply a fake."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Testability.cs",
      "code": "// HARD TO TEST: hidden static dependency on the real clock.\npublic static class BadDiscount\n{\n    public static decimal Apply(decimal price) =>\n        DateTime.Now.DayOfWeek == DayOfWeek.Friday ? price * 0.9m : price;\n}\n\n// EASY TO TEST: time is an injected abstraction, not a static call.\npublic interface IClock { DateTime Now { get; } }\npublic sealed class SystemClock : IClock { public DateTime Now => DateTime.Now; }\n\npublic sealed class DiscountService(IClock clock)   // primary constructor (C# 12+)\n{\n    public decimal Apply(decimal price) =>\n        clock.Now.DayOfWeek == DayOfWeek.Friday ? price * 0.9m : price;\n}\n\npublic sealed class FixedClock(DateTime fixedNow) : IClock\n{\n    public DateTime Now => fixedNow;   // a test can pin 'now' to any day\n}\n\n// In real tests these dates are fixtures; here we just demonstrate the seam.\nvar service = new DiscountService(new FixedClock(new DateTime(2026, 6, 19))); // a Friday\nConsole.WriteLine($\"Friday price of 100 = {service.Apply(100m)}\");\n\nvar monday = new DiscountService(new FixedClock(new DateTime(2026, 6, 22)));  // a Monday\nConsole.WriteLine($\"Monday price of 100 = {monday.Apply(100m)}\");"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Friday price of 100 = 90.0\nMonday price of 100 = 100"
    },
    {
      "kind": "paragraph",
      "text": "Same logic, but now the clock is a **seam**: production wires in `SystemClock`, tests wire in `FixedClock`, and the Friday branch is verifiable in milliseconds with no calendar dependence. This is why the dominant pattern in modern ASP.NET Core is **dependency injection through interfaces**, not static service locators. (The framework even ships an abstract `TimeProvider` in .NET 8+ for exactly this clock-abstraction need, so you often don't have to hand-roll `IClock` at all.) The rule of thumb: static for **stateless helpers and constants**; instances + interfaces for anything that holds **mutable state**, talks to the **outside world**, or that you'll want to **mock in a test**."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Mutable static state is shared by every thread, too",
      "text": "A web server handles many requests **concurrently** on different threads. A mutable `public static` field — a cached `List`, a running total, a `static DateTime LastRun` — is touched by all of them at once, so unsynchronized writes cause race conditions and torn data. If you truly need process-wide mutable state, make it thread-safe (`Interlocked`, `lock`, or a concurrent collection such as `ConcurrentDictionary`) — or, far better, model it as an injected **singleton service** so the sharing is explicit and the type stays testable."
    },
    {
      "kind": "examples",
      "intro": "A few quick judgment calls — would you make it static?",
      "examples": [
        {
          "label": "YES — pure helper, no state",
          "code": "public static class Slug\n{\n    public static string From(string title) =>\n        title.Trim().ToLowerInvariant().Replace(' ', '-');\n}\n\nConsole.WriteLine(Slug.From(\"My First Post\"));",
          "output": "my-first-post"
        },
        {
          "label": "YES — a true compile-time constant",
          "code": "public static class Physics\n{\n    public const double SpeedOfLightKmPerSec = 299_792.458;\n}\n\nConsole.WriteLine(Physics.SpeedOfLightKmPerSec);",
          "output": "299792.458"
        },
        {
          "label": "NO — mutable global; make it an injected service instead",
          "code": "// Anti-pattern: a process-wide mutable cache as plain static state.\npublic static class UserCache\n{\n    public static Dictionary<int, string> Names = new();  // who owns this? who locks it?\n}\nUserCache.Names[1] = \"Ada\";\nConsole.WriteLine(UserCache.Names[1]);\n// Prefer: register IUserCache as a singleton in DI and inject it.",
          "output": "Ada"
        }
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**`static` means 'belongs to the type, not an instance.'** One shared copy, reached through the type name (`Counter.TotalCreated`), never through an object.",
        "**Static methods** are stateless behavior (no `this`); a **`static class`** holds only static members, can't be instantiated or inherited — like `System.Math`.",
        "A **static constructor** runs once, lazily, on first use of the type — great for one-time setup; keep it cheap and never let it throw (a throw poisons the type for the whole process with `TypeInitializationException`).",
        "**`const`** is a compile-time literal inlined into call sites (and a binary-compat hazard across assemblies); **`static readonly`** is a single runtime value you can compute. Default to `static readonly` across library boundaries.",
        "Static **helps** for pure functions and constants; it **hurts** when it becomes mutable global state or a hidden dependency (like calling `DateTime.Now` directly) — that's what wrecks testability and thread safety.",
        "For anything with mutable state, I/O, or that you'll mock in tests, prefer **instances behind interfaces with dependency injection**, not static."
      ]
    }
  ]
};
