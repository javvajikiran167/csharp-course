import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "functional-patterns",
  "number": 5,
  "title": "Callbacks & Functional Patterns",
  "objective": "Apply delegates and lambdas to real design problems — callbacks, the strategy pattern, and passing behavior as data — the way modern .NET APIs are shaped.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Once you can put a function in a variable, you can put it in a **parameter** — and that single move quietly reshapes how you design code. Instead of writing `if/else` ladders that hard-code *what to do*, you let the caller hand you the behavior as data. That is the idea behind every callback, every strategy, and every `app.MapGet` you will ever write in modern .NET."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Prerequisite: students have already met `Func<>`, `Action<>`, lambdas, and multicast delegates in the previous lesson. This lesson is about *design* — using them to shape APIs — not about re-explaining the syntax.",
        "Lead with the Python bridge: they already pass `key=` to `sorted()` and decorators wrap functions. The leap is that C# makes the function's *signature* a compile-time type. Say this out loud once and move on.",
        "The emotional payload of this lesson is 'I can replace a switch statement with a parameter.' Land the strategy-pattern section hard; everything else (Retry, returning functions, LINQ, minimal APIs) is that same idea at different scales.",
        "Run every code block live if you can — the outputs are exact. The Retry demo with a flaky function is the crowd-pleaser; let it fail twice then succeed.",
        "Currency examples use the `:C` format specifier, which is culture-sensitive. The outputs shown assume the `en-US` culture (`$`). On a machine set to another locale the symbol and separators differ — mention this so a student in the EU isn't confused when they see `45,00 €`. In real apps you pass an explicit `CultureInfo` rather than relying on the ambient one.",
        "Worth showing live: the generic `Retry<T>` example does NOT loop forever when the operation always fails. On the final attempt the `catch when (attempt < maxAttempts)` guard is false, so the exception is not caught and propagates out. The `for (;;)` has no exit condition, but the successful `return` or the un-caught throw is what ends it. This trips people up; demo it.",
        "Save the readability-tradeoffs callout for the end, after they're excited, so they leave with judgment and not just a new hammer.",
        "Interview framing to drop in: 'strategy pattern in classic OOP is an interface with one method; in modern C# it's usually just a Func parameter.' That sentence has gotten students through real interviews."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Behavior is just another argument",
      "id": "behavior-as-data"
    },
    {
      "kind": "paragraph",
      "text": "You already pass **data** into methods: an `int`, a `string`, a `Customer`. The shift this lesson asks you to make is to also pass **behavior** — a method — into a method. In Python you do this constantly without thinking about it: `sorted(people, key=lambda p: p.age)` hands the `key` function to `sorted`, and `sorted` calls it back for each element. C# does exactly the same thing, except the parameter has a real type. A function that takes an `int` and returns an `int` has the type `Func<int, int>`; a function that takes a `string` and returns nothing is an `Action<string>`. Once that's a type, it can be a parameter — and the compiler will police what you pass."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// A method that takes BEHAVIOR as a parameter.\n// 'transform' is a function: takes an int, returns an int.\nstatic int[] Map(int[] numbers, Func<int, int> transform)\n{\n    var result = new int[numbers.Length];\n    for (int i = 0; i < numbers.Length; i++)\n        result[i] = transform(numbers[i]);   // call the behavior we were given\n    return result;\n}\n\nint[] prices = [100, 250, 99];\n\n// The CALLER decides what 'transform' means, inline:\nint[] withTax   = Map(prices, p => p + p / 10);   // add 10% tax (integer division)\nint[] doubled   = Map(prices, p => p * 2);\n\nConsole.WriteLine(string.Join(\", \", withTax));\nConsole.WriteLine(string.Join(\", \", doubled));",
      "filename": "Map.cs"
    },
    {
      "kind": "output",
      "output": "110, 275, 108\n200, 500, 198"
    },
    {
      "kind": "paragraph",
      "text": "Notice what `Map` does **not** know: it has no idea whether you're adding tax, doubling, or formatting. It owns the *mechanics* of looping; you own the *meaning*. That separation — generic plumbing here, specific decision there — is the entire payoff. If this looks familiar, it should: you have just hand-built a tiny version of LINQ's `Select`. We'll close that loop near the end."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python bridge",
      "text": "`Func<int, int>` is just Python's `Callable[[int], int]` with teeth. Python's type hint is optional and unchecked at runtime; C#'s `Func<int, int>` is enforced by the compiler. Pass a lambda with the wrong shape and your code **won't build** — the error arrives in your editor, not in production at 2am."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The strategy pattern, the modern way",
      "id": "strategy-pattern"
    },
    {
      "kind": "paragraph",
      "text": "Here is the scenario that makes this click. You're building the checkout for an online store, and shipping cost depends on the shipping method. The instinct from most languages is a `switch`. It works — until the business adds a fourth method, then a promotional free-shipping weekend, then a region-specific rule, and now every change means re-opening one ever-growing method and risking the cases you didn't touch."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Hard-coded: a switch you must keep editing",
          "items": [
            "Every new shipping option re-opens `CalculateShipping`.",
            "All strategies live tangled in one method.",
            "Hard to unit-test one rule in isolation.",
            "Adding a rule risks breaking the others (the open/closed problem)."
          ]
        },
        {
          "title": "Strategy as a Func: behavior passed in",
          "items": [
            "Each rule is its own self-contained function.",
            "`Checkout` is closed for modification, open for extension.",
            "Test any single strategy directly — it's just a function.",
            "Swap or inject the strategy at runtime (config, A/B test, DI)."
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "In classic object-oriented design, the **strategy pattern** means defining an interface with one method and writing a class per strategy. That's still valid, and we'll see when it's worth it. But when the strategy is a single operation, modern C# usually skips the ceremony: the strategy *is* a `Func`. The 'interface with one method' collapses into a parameter."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "using System.Globalization;\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\"); // make :C deterministic for this demo\n\n// The strategy's shape: given an order subtotal, return the shipping cost.\n// We don't even need a custom delegate type — Func<decimal, decimal> says it all.\nstatic decimal Checkout(decimal subtotal, Func<decimal, decimal> shippingStrategy)\n{\n    decimal shipping = shippingStrategy(subtotal);\n    return subtotal + shipping;\n}\n\n// Each strategy is a small, independently testable function:\nFunc<decimal, decimal> standard          = _   => 5.00m;\nFunc<decimal, decimal> freeOver50        = sub => sub >= 50m ? 0m : 5.00m;\nFunc<decimal, decimal> expressTenPercent = sub => sub * 0.10m;\n\nConsole.WriteLine($\"Standard:  {Checkout(40m, standard):C}\");\nConsole.WriteLine($\"Free>50:   {Checkout(40m, freeOver50):C}\");\nConsole.WriteLine($\"Free>50:   {Checkout(80m, freeOver50):C}\");\nConsole.WriteLine($\"Express:   {Checkout(80m, expressTenPercent):C}\");",
      "filename": "Strategy.cs"
    },
    {
      "kind": "output",
      "output": "Standard:  $45.00\nFree>50:   $45.00\nFree>50:   $80.00\nExpress:   $88.00",
      "label": "Output (en-US culture; :C uses the current culture's currency symbol)"
    },
    {
      "kind": "paragraph",
      "text": "`Checkout` never changes when the business invents a new shipping rule. You write a new `Func` and pass it in. In a real app that `Func` might come from configuration, from an A/B test bucket, or — most commonly — be registered in the dependency-injection container and handed to your service. The pattern is identical; only the *source* of the strategy moves."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "When to keep the interface instead",
      "text": "Reach for a `Func` when the strategy is **one operation and stateless-ish**. Reach for a real `interface` (e.g. `IShippingStrategy`) when the strategy needs **multiple related methods**, its own **dependencies injected** via a constructor, or a **name that documents intent** for the whole team. Rule of thumb: one verb → `Func`; a noun with several verbs → interface. Don't cargo-cult either direction."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Callbacks: let the caller fill in the blank",
      "id": "callbacks"
    },
    {
      "kind": "paragraph",
      "text": "A **callback** is behavior you pass in so that someone else's code can 'call you back' at the right moment. The canonical real-world example is a **retry helper**: *you* own the retry mechanics (loop, wait, give up after N attempts); the *caller* owns the actual work to retry. That work is a callback. Here it takes an `Action` (returns nothing) — perfect for an operation we run for its side effect, like calling a flaky payment gateway."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static void Retry(Action operation, int maxAttempts = 3)\n{\n    for (int attempt = 1; attempt <= maxAttempts; attempt++)\n    {\n        try\n        {\n            operation();          // run the caller's behavior\n            return;               // success — stop retrying\n        }\n        catch (Exception ex) when (attempt < maxAttempts)\n        {\n            // Only catch while we still have attempts left. On the LAST attempt\n            // the guard is false, so a final failure propagates to the caller.\n            Console.WriteLine($\"Attempt {attempt} failed ({ex.Message}); retrying...\");\n        }\n    }\n}\n\n// A flaky operation that fails twice, then succeeds:\nint calls = 0;\nRetry(() =>\n{\n    calls++;\n    Console.WriteLine($\"  charging card (call #{calls})\");\n    if (calls < 3) throw new InvalidOperationException(\"gateway timeout\");\n    Console.WriteLine(\"  charge succeeded!\");\n});",
      "filename": "Retry.cs"
    },
    {
      "kind": "output",
      "output": "  charging card (call #1)\nAttempt 1 failed (gateway timeout); retrying...\n  charging card (call #2)\nAttempt 2 failed (gateway timeout); retrying...\n  charging card (call #3)\n  charge succeeded!"
    },
    {
      "kind": "paragraph",
      "text": "`Retry` is reusable across your whole codebase precisely because it's ignorant of what it's retrying. The `when (attempt < maxAttempts)` exception filter is doing real work: it swallows failures *only while retries remain*, so if every attempt fails the last exception flies out to the caller instead of being silently eaten. Want a return value instead of a side effect? Make it generic and take a `Func<T>`. This is the same helper, now able to retry 'fetch the user' and give you the user back."
    },
    {
      "kind": "examples",
      "intro": "Two more shapes of the same callback idea — pick the delegate type that matches what the operation produces:",
      "examples": [
        {
          "label": "Retry that returns a value: Func<T>",
          "code": "static T Retry<T>(Func<T> operation, int maxAttempts = 3)\n{\n    for (int attempt = 1; ; attempt++)            // no exit condition...\n    {\n        try { return operation(); }               // ...success returns out of the loop\n        catch when (attempt < maxAttempts) { }    // swallow & loop while retries remain;\n    }                                             // the final failure simply isn't caught\n}\n\nint value = Retry(() => int.Parse(\"42\"));\nConsole.WriteLine(value);",
          "output": "42"
        },
        {
          "label": "Callback for customization: a progress reporter",
          "code": "static void Process(string[] items, Action<int, string> onProgress)\n{\n    for (int i = 0; i < items.Length; i++)\n        onProgress(i + 1, items[i]);\n}\n\nProcess([\"a.csv\", \"b.csv\"], (n, file) =>\n    Console.WriteLine($\"[{n}] processed {file}\"));",
          "output": "[1] processed a.csv\n[2] processed b.csv"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: a callback is not 'async'",
      "text": "Beginners often assume passing a function means it runs *later* or *in the background*. It doesn't. `operation()` above runs **synchronously, right where you call it**, like any method call. Callbacks are about *who decides the behavior*, not *when it runs*. Asynchrony (`async`/`await`, `Task`) is a separate concern you can layer on top — `Retry` could take a `Func<Task>` and `await` it — but a plain callback is just an ordinary in-line method call."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Returning functions, and higher-order methods",
      "id": "returning-functions"
    },
    {
      "kind": "paragraph",
      "text": "Functions are values, so a method can also **return** one. A method that takes a function, returns a function, or both, is called a **higher-order method** (the same 'higher-order function' idea from Python). The classic use is a **factory** that bakes in some configuration and hands you back a ready-to-use function — a closure that 'remembers' the configuration it was built with."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "using System.Globalization;\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\");\n\n// Returns a function that multiplies by a fixed rate.\n// The returned lambda CLOSES OVER 'rate' — it remembers it.\nstatic Func<decimal, decimal> MakeDiscount(decimal percentOff)\n{\n    decimal rate = 1m - percentOff / 100m;\n    return price => price * rate;       // a function, returned as a value\n}\n\nvar blackFriday = MakeDiscount(30);     // 30% off → rate 0.70, baked in\nvar clearance   = MakeDiscount(75);     // 75% off → rate 0.25, baked in\n\nConsole.WriteLine($\"{blackFriday(200m):C}\");   // 200 * 0.70 = 140\nConsole.WriteLine($\"{clearance(200m):C}\");     // 200 * 0.25 = 50",
      "filename": "Factory.cs"
    },
    {
      "kind": "output",
      "output": "$140.00\n$50.00",
      "label": "Output (en-US culture)"
    },
    {
      "kind": "paragraph",
      "text": "`blackFriday` and `clearance` are two different functions produced by the same factory, each carrying its own captured `rate`. This is exactly how a Python closure or a `functools.partial` behaves. In production .NET, returned functions show up as configured **validators**, **key selectors** for grouping, **retry policies**, and DI **factory registrations** (`Func<T>`) that lazily build an object only when first needed."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Closures capture the variable, not a snapshot",
      "text": "A returned lambda captures the **variable by reference**, not a copy of its value at creation time. If you build lambdas inside a classic `for (int i = 0; ...)` loop and capture `i`, every lambda shares the *same* `i` and sees its final value — a notorious bug and interview question. Inside the loop, copy to a fresh local first: `int local = i;` then capture `local`. (Good news: `foreach` was fixed back in C# 5 and captures a fresh variable per iteration, so that specific loop is safe.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "This is what LINQ and minimal APIs are made of",
      "id": "linq-and-aspnet"
    },
    {
      "kind": "paragraph",
      "text": "Everything above isn't an academic exercise — it's the literal foundation of the two APIs you'll touch most. **LINQ** is delegates from top to bottom: `Where` takes a `Func<T, bool>` (a predicate), `Select` takes a `Func<T, TResult>` (a transform — the grown-up version of our `Map`), `OrderBy` takes a key selector. You write the behavior as a lambda; LINQ owns the iteration. You've been using higher-order methods all along; now you know what they are."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "string[] products = [\"Keyboard\", \"USB cable\", \"Monitor\", \"Mouse\"];\n\n// Lengths: Keyboard=8, \"USB cable\"=9, Monitor=7, Mouse=5 — only \"Mouse\" is <= 6.\nvar shortNamesUpper = products\n    .Where(p => p.Length <= 6)         // Func<string,bool>   — the predicate\n    .Select(p => p.ToUpperInvariant()) // Func<string,string> — the transform\n    .OrderBy(p => p);                  // Func<string,string> — the key selector\n\nConsole.WriteLine(string.Join(\", \", shortNamesUpper));"
    },
    {
      "kind": "output",
      "output": "MOUSE"
    },
    {
      "kind": "paragraph",
      "text": "Only one product survives the filter — a useful reminder that `\"USB cable\"` is nine characters because the space counts. The point isn't the result; it's the shape: three lambdas, three different delegate types, and LINQ doing the looping for you. And **ASP.NET Core minimal APIs** are the strategy/callback pattern at web scale. When you write `app.MapGet(\"/products\", () => ...)`, that lambda **is** the behavior for the route — a callback the framework invokes when a request matches. The framework owns routing, model binding, and the HTTP pipeline; you own the handler. It's `Map` and `Retry` again, just wearing a web framework."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\n// The lambda is a callback the framework calls when a request arrives:\napp.MapGet(\"/health\", () => \"OK\");\n\napp.MapGet(\"/products/{id:int}\", (int id) =>\n    new { Id = id, Name = \"Mechanical Keyboard\" });\n\napp.Run();",
      "filename": "Program.cs (ASP.NET Core minimal API)"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: prefer the built-in delegate types",
      "text": "Reach for `Func<>`, `Action<>`, and `Predicate<T>` before hand-rolling a custom `delegate` type. They're instantly recognizable to every C# developer, compose cleanly with LINQ, and need no declaration. Define a named delegate only when it genuinely aids readability (a recurring signature with a meaningful name) or when you need `ref`/`out` parameters, which `Func`/`Action` can't express."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Readability is a real tradeoff",
      "id": "readability"
    },
    {
      "kind": "paragraph",
      "text": "Passing behavior as data is powerful, and like every powerful tool it can be overused. A lambda that's longer than a few lines, deeply nested callbacks, or a parameter list with three `Func`s in a row will leave the next reader (often future-you) squinting. Functional style buys you flexibility; it can cost you a clear, name-able call stack and an obvious place to set a breakpoint."
    },
    {
      "kind": "list",
      "items": [
        "**Name non-trivial lambdas.** If a lambda grows past a line or two, promote it to a named local function or method. `validator: IsValidEmail` reads better than ten inline characters of regex, and it gives you a stable reference if you ever need to reuse or test it.",
        "**Don't replace clear control flow with cleverness.** A simple `if` a reader understands at a glance beats a `Func` indirection they have to chase. Use strategy when behavior genuinely *varies*; not to look sophisticated.",
        "**Watch the parameter count.** One callback is clear; three positional `Func` parameters are a puzzle. Bundle them into an options object or use named arguments at the call site.",
        "**Keep callbacks fast and predictable.** A callback that throws, blocks, or has surprising side effects breaks the host method's assumptions. Keep them small and pure where you can.",
        "**Prefer named methods when you'll need to unsubscribe or compare.** A stored method group has a stable identity; an inline lambda you didn't capture can't be removed later."
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The trap: clever over clear",
      "text": "The goal of functional patterns is to make code **easier to change and easier to read** — not to prove you can chain six lambdas. If a junior teammate can't follow your call in fifteen seconds, the abstraction is costing more than it earns. When in doubt, give the behavior a name. A well-named `static bool IsEligible(Customer c)` passed as a method group is often the most professional choice of all."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "You can pass **behavior as a parameter** just like data — `Func<>` for functions that return a value, `Action<>` for ones that don't, `Predicate<T>` for true/false tests.",
        "The **strategy pattern** in modern C# is usually just a `Func` parameter: the host method owns the mechanics, the caller supplies the varying decision. Keep a real interface for multi-method strategies or ones needing injected dependencies.",
        "A **callback** is behavior the caller supplies so your code can invoke it at the right moment (e.g. a `Retry` helper). It runs **synchronously**, where you call it — callbacks are about *who decides*, not *when it runs*.",
        "Methods can **return functions**; a method that takes or returns functions is a **higher-order method**. Returned lambdas form closures that capture variables **by reference** — copy loop variables to a local to avoid the capture trap.",
        "**LINQ** (`Where`/`Select`/`OrderBy`) and **ASP.NET Core minimal APIs** (`app.MapGet(...)`) are this exact idea at scale — you've been writing higher-order code all along.",
        "Prefer built-in `Func`/`Action`/`Predicate` over custom delegates, and **name non-trivial lambdas**: functional patterns should make code clearer, not cleverer."
      ]
    }
  ]
};
