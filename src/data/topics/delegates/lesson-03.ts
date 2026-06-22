import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "lambdas",
  "number": 3,
  "title": "Lambda Expressions & Closures",
  "objective": "Write concise inline functions with the => lambda syntax, and understand closures — how a lambda captures variables from its surroundings.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Almost every line of modern C# you'll read at work — every LINQ query, every minimal-API route, every `Sort` with a custom comparison — is built on a single tiny operator: `=>`. Learn to read and write lambdas fluently and a huge fraction of the language suddenly clicks into place."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by having them recall Python's `lambda x: x*2` and `sorted(items, key=fn)` — the *first-class function* idea is already in their heads; we're giving it static types and richer syntax.",
        "Order of teaching that lands well: (1) the `=>` syntax and expression vs statement bodies, (2) what type a lambda *is* (Func/Action), (3) passing them to methods, (4) closures, (5) the for/foreach gotcha, (6) LINQ as the payoff.",
        "Run the for-loop vs foreach demo live. The `3, 3, 3` output genuinely surprises people; let them predict before you reveal it.",
        "Emphasize the mental upgrade: a lambda is not 'a function', it's an *expression that produces a delegate value*. That framing makes Func/Action assignment feel natural rather than magic.",
        "Resist over-comparing to Python. Hit the closure-by-reference difference hard (Python's late-binding loop bug is a great bridge) but keep the rest C#-native.",
        "If asked about expression trees (`Expression<Func<>>`), acknowledge it exists and powers EF Core's SQL translation, but defer the deep dive — it's a later lesson.",
        "Heads-up when demoing currency: `ToString(\"C\")` uses the machine's current culture, so `50m.ToString(\"C\")` prints `$50.00`, `€50,00`, or `₹50.00` depending on the box. Don't promise a specific symbol on screen unless you set `CultureInfo` explicitly — that's why the statement-lambda demo here shows the *shape*, not a pinned currency output."
      ]
    },
    {
      "kind": "paragraph",
      "text": "A **lambda expression** is an anonymous (unnamed) function you write inline, right where you need it. Coming from Python you already know the shape: `lambda x: x * 2`. In C# the same idea is `x => x * 2`. The `=>` token is read aloud as **\"goes to\"** — so `x => x * 2` is \"x goes to x times two.\" Everything to the left of the arrow is the parameter list; everything to the right is the body."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// One parameter — parentheses optional when the type is inferred\nvar doubler = (int x) => x * 2;\n\n// Two parameters — parentheses required\nvar add = (int a, int b) => a + b;\n\nConsole.WriteLine(doubler(5));   // call it like any function\nConsole.WriteLine(add(3, 4));"
    },
    {
      "kind": "output",
      "output": "10\n7"
    },
    {
      "kind": "paragraph",
      "text": "Notice there's no `return`, no curly braces, no method name, no separate declaration. The lambda *is* the function. The single-expression form you see above is called an **expression lambda**: its body is one expression, and that expression's value is automatically returned. This is the form you'll write 90% of the time."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Expression lambdas vs statement lambdas",
      "id": "expression-vs-statement"
    },
    {
      "kind": "paragraph",
      "text": "When a single expression isn't enough — you need a loop, an `if`, a local variable, multiple steps — switch to a **statement lambda**: wrap the body in `{ }` and write ordinary statements, using an explicit `return` if it produces a value. Same `=>` arrow, fuller body. The two examples below are both `Func<decimal, decimal>`; the only difference is how much room the body needs."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Expression lambda",
          "items": [
            "Body is one expression: `n => n * n`",
            "No braces, no `return` keyword",
            "The expression's value is the result",
            "Reads like math; great for `Select`, `Where`, key selectors",
            "`(a, b) => a + b`"
          ]
        },
        {
          "title": "Statement lambda",
          "items": [
            "Body is a `{ }` block of statements",
            "Use `return` explicitly to yield a value",
            "Can declare locals, loop, branch, log",
            "Use when the logic doesn't fit one expression",
            "`n => { var sq = n * n; return sq + 1; }`"
          ]
        }
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Expression lambda — concise\nFunc<decimal, decimal> withTax = price => price * 1.20m;\n\n// Statement lambda — room to breathe\nFunc<decimal, decimal> withTaxLogged = price =>\n{\n    var tax = price * 0.20m;\n    Console.WriteLine($\"Tax added: {tax}\");\n    return price + tax;\n};\n\nConsole.WriteLine(withTax(50m));        // one expression, value returned\nConsole.WriteLine(withTaxLogged(50m));  // logs a line, then returns the total"
    },
    {
      "kind": "output",
      "output": "60.00\nTax added: 10.00\n60.00"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Start expression, grow to statement",
      "text": "Write the expression form first — it's the cleaner default. Only reach for `{ }` and `return` when the logic genuinely needs more than one expression. In real code reviews, a statement lambda longer than a few lines is a hint you should extract a named method instead."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What *type* is a lambda? Func, Action, Predicate",
      "id": "func-action"
    },
    {
      "kind": "paragraph",
      "text": "Here's the part that trips up Pythonistas: in C#, every value has a static type, including a function value. A lambda by itself has no fixed type — it's an expression that gets *converted* into a **delegate**, which is C#'s name for a type-safe function reference. You usually don't declare your own delegate types; the .NET base class library ships three families that cover nearly everything:"
    },
    {
      "kind": "list",
      "items": [
        "**`Func<...>`** — a function that **returns a value**. The last type argument is the return type: `Func<int, int>` takes an `int` and returns an `int`; `Func<int, int, int>` takes two `int`s and returns an `int`.",
        "**`Action<...>`** — a function that **returns nothing** (`void`). `Action<string>` takes a `string` and returns nothing. A bare `Action` takes no arguments and returns nothing.",
        "**`Predicate<T>`** — a function that takes a `T` and returns a `bool`. It's really just a friendlier name for `Func<T, bool>`, and it's what methods like `List<T>.Find` and `List<T>.Exists` expect."
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// The lambda on the right is converted to the delegate type on the left\nFunc<int, int> square       = x => x * x;          // int -> int\nFunc<int, int, int> add     = (a, b) => a + b;     // (int,int) -> int\nAction<string> log          = msg => Console.WriteLine($\"[LOG] {msg}\");\nAction greet                = () => Console.WriteLine(\"Hello!\");\nPredicate<int> isEven       = n => n % 2 == 0;\n\nConsole.WriteLine(square(6));   // invoke with ordinary call syntax\nConsole.WriteLine(add(3, 4));\nlog(\"server started\");\ngreet();\nConsole.WriteLine(isEven(10));"
    },
    {
      "kind": "output",
      "output": "36\n7\n[LOG] server started\nHello!\nTrue"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: \"why can't I write `var f = x => x * 2;`?\"",
      "text": "Before C# 10 that was a hard error, because the compiler couldn't guess which delegate type you meant. Modern C# *can* often infer it — `var add = (int a, int b) => a + b;` works because you supplied the parameter types. But if the types aren't written, inference fails with **error CS8917 (\"the delegate type could not be inferred\")**, and you must name the target type: `Func<int,int> f = x => x * 2;`. When in doubt, declare the `Func`/`Action` type explicitly — it documents intent and always compiles."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Passing lambdas to methods (the real reason they exist)",
      "id": "passing-lambdas"
    },
    {
      "kind": "paragraph",
      "text": "Lambdas earn their keep when you hand behavior to a method, exactly like passing `key=` or a callback in Python. The receiving method declares a `Func`/`Action`/`Predicate` parameter, and you supply the lambda at the call site. This is the **strategy pattern** in one line: the method owns the *control flow*, you inject the *decision*."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// A reusable retry helper: caller supplies WHAT to run as a Func\nstatic T Retry<T>(Func<T> operation, int attempts)\n{\n    for (int i = 1; i <= attempts; i++)\n    {\n        try { return operation(); }\n        catch when (i < attempts) { Console.WriteLine($\"Attempt {i} failed, retrying...\"); }\n    }\n    throw new InvalidOperationException(\"All attempts failed.\");\n}\n\n// BCL methods that take lambdas — you use these constantly\nvar orders = new List<int> { 50, 12, 200, 7, 99 };\norders.Sort((a, b) => b - a);                  // custom comparison: descending\nint firstBig = orders.Find(amount => amount > 100);  // Predicate<int>\nbool anyTiny = orders.Exists(amount => amount < 10); // Predicate<int>\n\nConsole.WriteLine(string.Join(\", \", orders));\nConsole.WriteLine(firstBig);\nConsole.WriteLine(anyTiny);"
    },
    {
      "kind": "output",
      "output": "200, 99, 50, 12, 7\n200\nTrue"
    },
    {
      "kind": "paragraph",
      "text": "`List<T>.Sort`, `Find`, `Exists`, `RemoveAll` — these have taken lambdas since the dawn of generics, and they're Microsoft's own canonical examples of \"delegate as callback.\" The same pattern scales all the way up to web frameworks: in ASP.NET Core, `app.MapGet(\"/health\", () => \"OK\")` registers a lambda as the handler for an HTTP route. The arrow is everywhere."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Closures: lambdas remember their surroundings",
      "id": "closures"
    },
    {
      "kind": "paragraph",
      "text": "A lambda can use variables from the enclosing scope — not just its own parameters. When it does, it **captures** those variables, and the resulting function-plus-captured-state is called a **closure**. This is the same concept as in Python, and it's what makes lambdas so powerful: the function carries a little piece of its birthplace with it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int factor = 10;\nFunc<int, int> scale = n => n * factor;   // captures the variable 'factor'\n\nConsole.WriteLine(scale(5));   // 5 * 10\n\nfactor = 100;                   // mutate the captured variable AFTER creating the lambda\nConsole.WriteLine(scale(5));   // 5 * 100  -- the lambda sees the new value!"
    },
    {
      "kind": "output",
      "output": "50\n500"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Captured by reference, not by snapshot",
      "text": "This is the #1 surprise for newcomers. The lambda did **not** copy `factor`'s value (10) when it was created — it captured the *variable itself*. Change `factor` later and the lambda sees the change. Python behaves the same way (the classic late-binding closure trap), which is why `lambda: i` inside a loop bites people in both languages. If you want a frozen snapshot, copy the value into a fresh local first."
    },
    {
      "kind": "paragraph",
      "text": "Captured state also *outlives* the method that created it. Here a factory method returns a counter; the local `count` is gone from the method's perspective the moment it returns, yet the closure keeps it alive and private — a tidy, encapsulated bit of mutable state with no class required:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static Func<int> MakeCounter()\n{\n    int count = 0;             // local to MakeCounter...\n    return () => ++count;      // ...but captured and kept alive by the closure\n}\n\nvar next = MakeCounter();\nConsole.WriteLine($\"{next()} {next()} {next()}\");  // independent, stateful counter"
    },
    {
      "kind": "output",
      "output": "1 2 3"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The classic captured-loop-variable gotcha",
      "id": "loop-variable-trap"
    },
    {
      "kind": "paragraph",
      "text": "This is one of the most famous traps in C# — and a perennial interview question. Build a list of lambdas inside a classic `for` loop, capturing the loop counter `i`, then call them all afterward. Beginners expect `0, 1, 2`. They get something else:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var fromFor = new List<Func<int>>();\nfor (int i = 0; i < 3; i++)\n    fromFor.Add(() => i);          // every lambda captures the SAME 'i'\n\nConsole.WriteLine(string.Join(\", \", fromFor.Select(f => f())));"
    },
    {
      "kind": "output",
      "output": "3, 3, 3"
    },
    {
      "kind": "paragraph",
      "text": "Why `3, 3, 3`? A classic `for` loop has exactly **one** `i` variable for the whole loop. All three lambdas captured that same single variable. By the time you *call* them, the loop has finished and `i` holds `3` (the value that failed the `i < 3` test). Every closure reads the same final value. The fix is to copy the counter into a fresh local declared *inside* the loop body, so each iteration captures a distinct variable:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var fixedFor = new List<Func<int>>();\nfor (int i = 0; i < 3; i++)\n{\n    int local = i;                 // a NEW 'local' each iteration\n    fixedFor.Add(() => local);     // each lambda captures its own copy\n}\n\nConsole.WriteLine(string.Join(\", \", fixedFor.Select(f => f())));"
    },
    {
      "kind": "output",
      "output": "0, 1, 2"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Good news: `foreach` was fixed in C# 5 (2012)",
      "text": "A `foreach` loop captures a **fresh variable per iteration**, so the trap does *not* apply there — `foreach (var x in items) actions.Add(() => x);` correctly yields distinct values. Only the classic `for (int i = ...)` counter still shares one variable. Knowing precisely which loop has the bug (`for`, not `foreach`) is exactly what interviewers are probing for."
    },
    {
      "kind": "examples",
      "intro": "Proof of the difference, side by side — same shape, different capture behavior:",
      "examples": [
        {
          "label": "foreach captures per-iteration (correct)",
          "code": "var fromForEach = new List<Func<int>>();\nforeach (var x in new[] { 0, 1, 2 })\n    fromForEach.Add(() => x);\n\nConsole.WriteLine(string.Join(\", \", fromForEach.Select(f => f())));",
          "output": "0, 1, 2"
        },
        {
          "label": "for shares one counter (the trap)",
          "code": "var fromFor = new List<Func<int>>();\nfor (int i = 0; i < 3; i++)\n    fromFor.Add(() => i);\n\nConsole.WriteLine(string.Join(\", \", fromFor.Select(f => f())));",
          "output": "3, 3, 3"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The payoff: lambdas are the syntax LINQ runs on",
      "id": "lambdas-power-linq"
    },
    {
      "kind": "paragraph",
      "text": "Here's why this lesson matters so much. **LINQ** — the query system you'll use to filter, transform, sort, and aggregate every collection in real C# — is built almost entirely on lambdas. `Where` takes a `Func<T, bool>`. `Select` takes a `Func<T, TResult>`. `OrderBy`, `Any`, `First`, `GroupBy`, `Sum` — all of them accept lambdas. When you write a LINQ query, you are writing lambdas; you just may not have realized it yet."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var names = new[] { \"Ada\", \"Linus\", \"Grace\", \"Ken\" };\n\n// Read this as: keep the short names, then upper-case them\nvar shortUpper = names\n    .Where(n => n.Length <= 3)     // Func<string,bool> — a predicate\n    .Select(n => n.ToUpper())      // Func<string,string> — a transform\n    .ToList();\n\nConsole.WriteLine(string.Join(\", \", shortUpper));"
    },
    {
      "kind": "output",
      "output": "ADA, KEN"
    },
    {
      "kind": "paragraph",
      "text": "Compare that to Python's `[n.upper() for n in names if len(n) <= 3]`. Same idea, but C# expresses each step as a lambda passed to a method, and those steps **compose**: the output of `Where` flows into `Select` into `ToList`. Once lambdas feel natural, LINQ stops looking like new syntax and starts looking like the function-passing you already understand — which is why we taught lambdas *before* diving into LINQ."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: name the lambda when it stops being obvious",
      "text": "A short inline lambda like `n => n.Length <= 3` is perfectly readable. But when the logic grows — multiple conditions, several statements, business rules — extract it into a named method (or a named `Func` variable) and pass the method by name: `.Where(IsActiveCustomer)`. Named methods are easier to test, reuse, and read in a stack trace. Lambdas are for *small, local, throwaway* behavior."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A glimpse of C# 14: modifiers without the type",
      "id": "csharp-14-note"
    },
    {
      "kind": "paragraph",
      "text": "One small modern ergonomics win, in case you meet it in newer codebases. A lambda parameter that carries a modifier like `out`, `ref`, or `in` used to *require* you to also spell out the full parameter type. As of **C# 14 / .NET 10**, the compiler can infer the type from the delegate, so you can write just the modifier and the name:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "TryParseInt parse = (s, out r) => int.TryParse(s, out r);  // C# 14: 'out r', not 'out int r'\n\nConsole.WriteLine($\"{parse(\"42\", out var n)} {n}\");\nConsole.WriteLine($\"{parse(\"xyz\", out var m)} {m}\");\n\ndelegate bool TryParseInt(string s, out int result);",
      "filename": "Csharp14Lambda.cs"
    },
    {
      "kind": "output",
      "output": "True 42\nFalse 0"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Nice-to-have, not need-to-have",
      "text": "This is a refinement, not a new paradigm — lambdas work the way they have for years. Don't go hunting for places to use it; just recognize it when you read it. (One catch: a `params` lambda parameter still requires its explicit type — leaving it off is **error CS9272**.) Master the fundamentals above first; treat C# 14's lambda-modifier syntax as polish."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`=>` (\"goes to\") defines a lambda: parameters on the left, body on the right. `x => x * 2` is the everyday form.",
        "**Expression lambda** = one expression, value auto-returned, no braces. **Statement lambda** = a `{ }` block with explicit `return`. Start with expression form; grow only when needed.",
        "A lambda is converted to a **delegate** type. Prefer the built-ins: `Func<...>` returns a value, `Action<...>` returns void, `Predicate<T>` returns bool.",
        "Passing a lambda to a method injects behavior — `Sort`, `Find`, `MapGet`, and all of LINQ work this way. It's the strategy pattern in one line.",
        "A **closure** captures surrounding variables **by reference, not by snapshot** — mutate the variable later and the lambda sees the new value. Captured locals can outlive the method that created them.",
        "Classic `for` loops share one counter, so capturing it gives `3, 3, 3`; copy it to a local inside the loop to fix it. `foreach` already captures per-iteration (fixed in C# 5).",
        "**LINQ is lambdas.** `Where`/`Select`/`OrderBy` all take `Func`/`Predicate` — master lambdas and LINQ becomes obvious."
      ]
    }
  ]
};
