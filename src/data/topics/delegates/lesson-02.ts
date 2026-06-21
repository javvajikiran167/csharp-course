import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "func-action",
  "number": 2,
  "title": "Func, Action & Predicate",
  "objective": "Use the three built-in generic delegates — Func, Action, and Predicate — instead of declaring your own delegate types.",
  "blocks": [
    {
      "kind": "lead",
      "text": "In the last lesson you learned that a delegate is a type-safe function pointer — and that the compiler turns `delegate int Transformer(int x);` into a whole class. The good news: in real C# code you almost never write that line. The .NET base class library already ships three generic delegate families — **`Func`**, **`Action`**, and **`Predicate`** — that cover virtually every callback you'll ever pass around."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by reminding students of last lesson: custom `delegate` declarations exist, but this lesson is the 'so why did I learn that?' payoff — the BCL pre-declares the ones you need.",
        "The single most important mental hook: **Func returns something, Action returns nothing (void), Predicate returns a bool.** Repeat it three times; everything else is arity detail.",
        "Live-code the `FindAll` example — it's the moment Python folks realize they've been doing this all along with `filter(lambda x: ..., items)`.",
        "Watch for the arity confusion: in `Func<int, string>` the LAST type parameter is the return type, not the first. This trips up almost everyone. Slow down here.",
        "The decimal-scale detail in the pricing output (`420.0` vs `350`) is a genuine surprise — even seasoned devs forget that `decimal` carries its own scale. It's worth 60 seconds: it teaches that `decimal` is not just 'a more precise double'.",
        "The C# 14 lambda-modifier bit is a 'nice to know' — show it, don't drill it. Beginners won't write `out` lambdas for weeks.",
        "If time is short, the must-land beats are: the three signatures, why you don't write custom delegates, and passing one to a method."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "You already met these in Python",
      "id": "python-bridge"
    },
    {
      "kind": "paragraph",
      "text": "In Python, passing a function as a value is so natural you barely notice it: `sorted(items, key=get_price)`, `filter(is_active, users)`, `map(str.upper, names)`. The function is just an object you hand to another function. C# does exactly the same thing — but because C# is statically typed, the function-value needs a **type**. That type is a delegate. The only question is *which* delegate type, and the answer is almost always one of these three:"
    },
    {
      "kind": "list",
      "items": [
        "**`Func<...>`** — a function that **returns a value**. The Python equivalent of any `lambda` or function that ends in `return something`.",
        "**`Action<...>`** — a function that **returns nothing** (`void`). The equivalent of a Python function that just *does* something — prints, saves, sends — with no `return`.",
        "**`Predicate<T>`** — a function that takes one `T` and **returns a `bool`**. The equivalent of the test you pass to Python's `filter`."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why these exist",
      "text": "Before generics, every callback needed its own hand-written `delegate` type. That meant codebases were littered with one-line declarations like `delegate bool IsValid(Order o);`. The generic `Func`/`Action`/`Predicate` families (introduced years ago, refined ever since) made those redundant. Today, declaring a custom delegate is the exception — you reach for it only when a **named type genuinely reads better**, or when you need `ref`/`out` parameters, which `Func`/`Action` can't express."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The three signatures, side by side",
      "id": "the-three"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Delegates.cs",
      "code": "// Func<...>  — last type parameter is the RETURN type\nFunc<int, int, int> add = (a, b) => a + b;          // (int, int) -> int\nFunc<string> getStatus       = () => \"ready\";       // ()         -> string\n\n// Action<...> — returns void; there is no return-type parameter\nAction<string> log = msg => Console.WriteLine($\"[log] {msg}\");\nAction greet       = () => Console.WriteLine(\"hi\");\n\n// Predicate<T> — takes one T, returns bool (it's really Func<T, bool>)\nPredicate<int> isEven = n => n % 2 == 0;\n\nConsole.WriteLine(add(3, 4));   // call them like normal methods\nlog(\"server started\");\nConsole.WriteLine(isEven(10));\nConsole.WriteLine(isEven(7));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "7\n[log] server started\nTrue\nFalse"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: where's the return type in Func?",
      "text": "In `Func<int, string, bool>`, the type parameters are read **inputs first, return type LAST**. So that reads as *“takes an `int` and a `string`, returns a `bool`.”* This catches everyone at first — you instinctively expect the return type up front (as in `int Foo(...)`). With `Func`, it's always the final slot. And `Func<string>` with just a **single type argument**? That means *no inputs at all* — the lone type is the return type."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Arity: how many parameters can they take?",
      "id": "arity"
    },
    {
      "kind": "paragraph",
      "text": "There isn't just one `Func` — the BCL ships overloads from zero up to sixteen input parameters: `Func<TResult>`, `Func<T1, TResult>`, `Func<T1, T2, TResult>`, all the way to `Func<T1, ..., T16, TResult>`. `Action` mirrors that from `Action` (no parameters) through `Action<T1, ..., T16>`. **`Predicate<T>` is the odd one out: it always takes exactly one parameter and always returns `bool`** — it's literally a more readable name for `Func<T, bool>`. If you need a two-argument test, you don't use `Predicate`; you use `Func<T1, T2, bool>`."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Func<...>  (returns a value)",
          "items": [
            "Last type parameter = the return type",
            "Arities: `Func<TResult>` ... `Func<T1,…,T16,TResult>`",
            "Use for: key selectors, transforms, factories, validators that return data",
            "LINQ's `Select`, `OrderBy`, and `Where` all take `Func`",
            "Python analogy: any `lambda`/function ending in `return`"
          ]
        },
        {
          "title": "Action<...>  (returns void)",
          "items": [
            "No return-type parameter — produces no value",
            "Arities: `Action` ... `Action<T1,…,T16>`",
            "Use for: side effects — log, save, send, notify, render",
            "`List<T>.ForEach`, event handlers, progress callbacks",
            "Python analogy: a function that just *does* something, no `return`"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Passing them to methods (the whole point)",
      "id": "passing"
    },
    {
      "kind": "paragraph",
      "text": "A delegate value is only useful because you can hand it to *another* method — letting the caller inject behavior. This is the everyday \"strategy pattern,\" minus the ceremony of interfaces and classes. Here's a tiny pricing helper from a real e-commerce backend: the method knows *how to total a cart*, but the caller decides *how to adjust each price* (add tax, apply a discount, convert currency)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Pricing.cs",
      "code": "using System.Globalization;\nvar ci = CultureInfo.InvariantCulture;\n\n// 'adjust' is a Func: takes a decimal, returns a decimal.\nstatic decimal TotalAfter(List<decimal> prices, Func<decimal, decimal> adjust)\n{\n    decimal sum = 0;\n    foreach (var p in prices)\n        sum += adjust(p);     // caller decides what 'adjust' means\n    return sum;\n}\n\nvar prices = new List<decimal> { 100m, 200m, 50m };\n\n// Same method, three different behaviors injected at the call site:\ndecimal withTax     = TotalAfter(prices, p => p * 1.2m);   // +20% tax\ndecimal with10Off   = TotalAfter(prices, p => p * 0.9m);   // 10% discount\ndecimal unchanged   = TotalAfter(prices, p => p);          // identity\n\nConsole.WriteLine(withTax.ToString(ci));\nConsole.WriteLine(with10Off.ToString(ci));\nConsole.WriteLine(unchanged.ToString(ci));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "420.0\n315.0\n350"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why 420.0 has a decimal but 350 doesn't",
      "text": "Look closely at that output: the tax and discount totals print `420.0` and `315.0`, but the unchanged total prints plain `350` — no `.0`. That's not a typo; it's `decimal` revealing one of its defining features. Unlike `double`, a `decimal` carries its own **scale** (the number of digits after the point), and arithmetic *preserves* it. Multiplying by `1.2m` (scale 1) yields results with scale 1, so they print with one decimal place. The identity case just adds whole numbers (`100m + 200m + 50m`, all scale 0), so the result has scale 0 and prints as `350`. This is exactly why `decimal` is the right type for money — it never silently rounds — but it's also why you usually format currency explicitly, e.g. `total.ToString(\"C\", ci)` or `\"F2\"`, rather than trusting the natural scale."
    },
    {
      "kind": "paragraph",
      "text": "Notice what we *didn't* do: we never declared `delegate decimal Adjuster(decimal d);`. `Func<decimal, decimal>` says everything that custom type would, and any reader instantly knows it means \"decimal in, decimal out.\" That's why custom delegate types have largely vanished from modern codebases — the built-in ones are self-documenting and require zero boilerplate."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Predicate in action: List.FindAll",
      "id": "findall"
    },
    {
      "kind": "paragraph",
      "text": "`Predicate<T>` shows up most visibly in the `List<T>` API. `FindAll`, `Find`, `Exists`, `RemoveAll`, and `TrueForAll` all take a `Predicate<T>` — a test that returns `true`/`false` for each element. `FindAll` is C#'s built-in equivalent of Python's `filter`: it returns a new list of every element that passes the test."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Orders.cs",
      "code": "var orders = new List<decimal> { 19.99m, 250m, 5m, 1200m, 80m };\n\n// A Predicate<decimal>: returns true for orders we consider 'big'.\nPredicate<decimal> isBigOrder = amount => amount >= 100m;\n\n// FindAll keeps every element for which the predicate is true.\nList<decimal> bigOrders = orders.FindAll(isBigOrder);\n\nConsole.WriteLine(string.Join(\", \", bigOrders));\nConsole.WriteLine($\"Found {bigOrders.Count} big orders\");\n\n// You can also pass the lambda inline — no named variable needed:\nbool anyHuge = orders.Exists(a => a >= 1000m);\nConsole.WriteLine($\"Any order over 1000? {anyHuge}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "250, 1200\nFound 2 big orders\nAny order over 1000? True"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: Func/Action/Predicate first, custom delegate rarely",
      "text": "Reach for the built-in generic delegates by default. Declare a custom `delegate` type only when (1) a **named type** makes an API dramatically clearer — e.g. a `delegate decimal ShippingCalculator(Order o)` that you reuse across a domain — or (2) you need parameter modifiers like `out`/`ref` that `Func`/`Action` simply cannot express (think `delegate bool TryParse<T>(string s, out T result);`). For everything else, the built-ins win on readability and zero boilerplate."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A note from .NET 10 / C# 14",
      "id": "csharp-14"
    },
    {
      "kind": "paragraph",
      "text": "One small ergonomics upgrade lands in C# 14. When a lambda parameter carries a modifier like `out`, `ref`, or `in`, you used to be forced to also write its full type. Now the type can be **inferred from the delegate**, so the `out T result` parameter of that custom `TryParse` delegate can be written as just `out r`:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Csharp14Lambda.cs",
      "code": "delegate bool TryParse<T>(string s, out T result);\n\n// C# 14: 'out r' — no need to repeat 'out int r'; the type is inferred.\nTryParse<int> parse = (s, out r) => int.TryParse(s, out r);\n\nbool ok = parse(\"42\", out int value);\nConsole.WriteLine($\"{ok} -> {value}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "True -> 42"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why this snippet still uses a custom delegate",
      "text": "This is exactly case (2) from the best-practice tip: `Func`/`Action` **cannot** declare an `out` parameter, so a `TryParse`-style callback genuinely needs a custom delegate type. It's the clearest example of when the built-ins *don't* suffice — and a tidy showcase for the C# 14 inference. (One limitation: a `params` parameter still requires its explicit type — the compiler rejects an implicitly typed `params` lambda parameter.)"
    },
    {
      "kind": "examples",
      "intro": "A quick gallery of the same three delegates in real-world roles you'll meet constantly:",
      "examples": [
        {
          "label": "Func as a LINQ key selector",
          "code": "var users = new List<(string Name, int Age)>\n{\n    (\"Ada\", 36), (\"Linus\", 22), (\"Grace\", 85)\n};\n\n// OrderBy takes a Func<T, key>. Here: Func<(string,int), int>.\nvar youngestFirst = users.OrderBy(u => u.Age).First();\nConsole.WriteLine(youngestFirst.Name);",
          "output": "Linus"
        },
        {
          "label": "Action for side effects (List.ForEach)",
          "code": "var names = new List<string> { \"api\", \"db\", \"cache\" };\n\n// ForEach takes an Action<T> — runs it for each element, returns nothing.\nnames.ForEach(n => Console.WriteLine($\"starting {n}...\"));",
          "output": "starting api...\nstarting db...\nstarting cache..."
        },
        {
          "label": "Func<T> as a lazy factory (DI-style)",
          "code": "// A Func<T> with no inputs defers creation until you call it.\nFunc<Guid> newId = () => Guid.NewGuid();\nConsole.WriteLine(newId() != newId());   // two calls, two different ids",
          "output": "True"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Predicate<T> vs Func<T, bool> — they're not interchangeable in signatures",
      "text": "Although a `Predicate<int>` and a `Func<int, bool>` describe the *same shape*, they are **different types**, and the compiler won't silently swap one for the other. `List<T>.FindAll` wants a `Predicate<T>`; LINQ's `Where` wants a `Func<T, bool>`. A lambda like `x => x > 0` happily converts to either, so inline lambdas just work — but if you store one in a typed variable, you must store it as the type the target method expects (or convert explicitly, e.g. `new Func<int, bool>(myPredicate)`)."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**`Func<…, TResult>`** returns a value; the **last** type parameter is the return type. **`Action<…>`** returns `void`. **`Predicate<T>`** takes one `T` and returns `bool` (a readable alias for `Func<T, bool>`).",
        "All three come in arities from zero parameters up to sixteen — so you essentially never need to declare your own delegate type anymore.",
        "Declare a **custom delegate** only when a named type reads better, or when you need `out`/`ref` parameters that `Func`/`Action` can't express (e.g. a `TryParse`-style callback).",
        "You pass these to methods to inject behavior — the lightweight, everyday strategy pattern. LINQ (`Where`, `Select`, `OrderBy`) is `Func`/`Predicate` everywhere.",
        "`List<T>.FindAll(Predicate<T>)` is C#'s `filter`: it returns a new list of every element that passes the test.",
        "`decimal` preserves its own scale through arithmetic — that's why `350` printed without a `.0` while `420.0` kept one. For money, format explicitly (`\"C\"` or `\"F2\"`) rather than relying on the natural scale.",
        "C# 14 lets lambda parameters with modifiers (`out r`, `ref x`) **omit the explicit type** when it's inferable — a small but pleasant ergonomic win (though `params` parameters still need their type)."
      ]
    }
  ]
};
