import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "generic-methods",
  "number": 1,
  "title": "Generic Methods",
  "objective": "Write one method that works on many types with full type safety, using type parameters and type inference.",
  "blocks": [
    {
      "kind": "lead",
      "text": "In Python you'd write `def first(items): return items[0]` once and it works on a list of anything. C# wants that same write-it-once power, but without throwing away the type safety you came here for. **Generic methods** are how you get both: one method, every type, checked by the compiler."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by reproducing the *pain* before the cure: write `SwapInts`, then `SwapStrings`, and let students feel the copy-paste. Generics land harder when they've seen the duplication.",
        "The single biggest 'aha' for Python folks: the `<T>` is *real* at runtime, not an erased hint. Keep hammering 'the compiler checks this for you' — that's the whole pitch.",
        "Type inference is the comfort hook. Show that `Swap(ref a, ref b)` reads almost like Python despite being fully typed. Most students assume generics mean noisy `<...>` everywhere; prove otherwise.",
        "`Max<T>` will tempt you into constraints (`where T : IComparable<T>`). Acknowledge it in one callout but DON'T teach constraints deeply here — that's the next lesson. Use the built-in comparer trick so `Max<T>` compiles today without derailing.",
        "Live-code Swap with and without `ref` to show why value semantics matter; Python students have no `ref` concept and will be surprised a method can't reassign the caller's variable.",
        "Watch the date trap when live-coding: `DateOnly.ToString()` with no format is **culture-dependent**, so a machine set to en-GB prints `19/06/2026` while en-US prints `6/19/2026`. The lesson formats every date as `yyyy-MM-dd` (ISO 8601) precisely so the printed output is identical on every machine — explain that choice if a student asks why we don't just print the date raw.",
        "If time is short, the must-haves are: the problem, declaring `<T>`, inference, and Swap. Multiple type params and Max are the stretch."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The problem: one idea, painfully many copies",
      "id": "the-problem"
    },
    {
      "kind": "paragraph",
      "text": "Imagine you're on a backend team and you keep needing to swap two values — two queue priorities, two grid cells in a game, two columns being reordered in a UI. The logic is trivial and identical every time. But C# is **statically typed**: every variable has a known type at compile time. So a naive first attempt forces you to write the same method once per type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Swapping.cs",
      "code": "// Without generics: copy-paste, once per type.\nstatic void SwapInts(ref int a, ref int b)\n{\n    (a, b) = (b, a);\n}\n\nstatic void SwapStrings(ref string a, ref string b)\n{\n    (a, b) = (b, a);\n}\n\n// ...and SwapDecimals, SwapDateTimes, SwapPlayer... forever."
    },
    {
      "kind": "paragraph",
      "text": "The body is byte-for-byte the same; only the type changed. In Python you'd never hit this — duck typing means one `swap` works on everything. So C# beginners often reach for the escape hatch they *do* know: make everything `object` (C#'s universal base type, like Python's `object`) and cast back later."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "TheObjectTrap.cs",
      "code": "// The 'object' trap: one method, but type safety is gone.\nstatic object FirstOrSelf(object[] items) => items.Length > 0 ? items[0] : items;\n\nint[] scores = { 90, 85, 100 };\nobject result = FirstOrSelf(scores.Cast<object>().ToArray());\n\n// We KNOW it's an int, but the compiler doesn't. We must cast:\nint best = (int)result;         // boxing on the way in, a cast that can throw on the way out\nstring oops = (string)result;   // compiles fine — explodes at RUNTIME"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Why `object` is the wrong fix",
      "text": "Using `object` throws away the one thing you switched to C# for: **compile-time checking**. `(string)result` above compiles happily and then throws `InvalidCastException` (\"Unable to cast object of type 'System.Int32' to type 'System.String'\") when the program runs — exactly the class of bug a typed language is supposed to prevent. On top of that, putting an `int` into an `object` **boxes** it: the runtime allocates a little wrapper on the heap, costing memory and speed. Generics give you the single method *and* keep the type, with zero boxing."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Declaring a generic method: meet `<T>`",
      "id": "declaring-generic"
    },
    {
      "kind": "paragraph",
      "text": "A generic method has a **type parameter** — a placeholder for a type the caller will fill in. You declare it in angle brackets right after the method name. By strong convention that placeholder is named `T` (for \"Type\") when there's just one. Inside the method, `T` behaves like a real type you can use for parameters, locals, and the return type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Swap.cs",
      "code": "// One method. Works for int, string, decimal, your own Player class — anything.\nstatic void Swap<T>(ref T a, ref T b)\n{\n    (a, b) = (b, a);\n}\n\nint x = 1, y = 2;\nSwap<int>(ref x, ref y);     // explicit: T is int\nConsole.WriteLine($\"x={x}, y={y}\");\n\nstring left = \"prod\", right = \"staging\";\nSwap<string>(ref left, ref right);\nConsole.WriteLine($\"{left} | {right}\");"
    },
    {
      "kind": "output",
      "output": "x=2, y=1\nstaging | prod"
    },
    {
      "kind": "paragraph",
      "text": "Read `Swap<T>` as: \"for **some** type `T`, here's how to swap two `T`s.\" Both parameters are `ref T`, which means they must be the *same* `T` — you can't swap an `int` with a `string`, and that restriction is a feature, not a bug. The `ref` keyword (C# has no exact Python equivalent) tells the method to operate on the caller's actual variables, so the swap is visible after the call returns."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python's `TypeVar` is the closest analogy",
      "text": "If you've used Python's `typing`, `Swap<T>` is morally the same as `T = TypeVar(\"T\")` and `def swap(a: T, b: T) -> None`. The crucial difference: Python's hints are **optional documentation** that tools *may* check. C#'s `<T>` is **enforced** by the compiler and preserved by the runtime — `List<int>` genuinely stores `int`s, and `Swap<int>` genuinely refuses anything that isn't an `int`. Type safety here is a guarantee, not a suggestion."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Type inference: you rarely write the `<T>`",
      "id": "type-inference"
    },
    {
      "kind": "paragraph",
      "text": "Writing `Swap<int>(...)` works, but it's noisy — and in real code you almost never do it. The compiler can usually **infer** `T` from the arguments you pass. If `a` and `b` are `int`s, then `T` must be `int`; the compiler figures that out and you just call `Swap(...)`. This is what makes generic C# read almost as cleanly as the dynamic Python you're used to."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Inference.cs",
      "code": "int a = 10, b = 20;\nSwap(ref a, ref b);            // compiler infers T = int\n\ndecimal price = 9.99m, tax = 0.80m;\nSwap(ref price, ref tax);      // infers T = decimal\n\nvar monday = new DateOnly(2026, 6, 15);\nvar friday = new DateOnly(2026, 6, 19);\nSwap(ref monday, ref friday); // infers T = DateOnly\n\nConsole.WriteLine($\"{a}, {b}, {price}, {tax}\");\n// Format dates as ISO 8601 so the output is identical on every machine.\nConsole.WriteLine($\"{monday:yyyy-MM-dd}, {friday:yyyy-MM-dd}\");"
    },
    {
      "kind": "output",
      "output": "20, 10, 0.80, 9.99\n2026-06-19, 2026-06-15"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: printing a date with no format is culture-dependent",
      "text": "`Console.WriteLine(monday)` (or `$\"{monday}\"`) calls `DateOnly.ToString()` with **no** format, which uses the machine's current culture. On an en-US box that prints `6/15/2026`; on an en-GB box the *same code* prints `15/06/2026`. That's why this lesson always passes an explicit format like `:yyyy-MM-dd` — it pins the output so what you read here matches what your console shows. When a date crosses a system boundary (a log, an API response, a file), always format it explicitly; never rely on the ambient culture."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: let inference do the work",
      "text": "Omit the explicit type argument whenever the compiler can infer it — `Swap(ref a, ref b)` over `Swap<int>(ref a, ref b)`. The code is cleaner and stays correct if a variable's type later changes. You only need to spell out `<T>` when there's nothing to infer *from* — typically when `T` appears only in the **return type**, e.g. `var list = CreateList<string>();`. There the compiler has no argument to read the type off of, so you tell it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Multiple type parameters",
      "id": "multiple-params"
    },
    {
      "kind": "paragraph",
      "text": "A method can take more than one type parameter. When you do, give them **meaningful names** instead of `T1`, `T2`. The .NET conventions you'll see everywhere are `TKey`, `TValue`, `TSource`, and `TResult` — all prefixed with `T` so they're instantly recognizable as type parameters. A classic real-world shape is a projection helper: take a source item and a function that turns it into something else."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Project.cs",
      "code": "// TSource comes in, TResult goes out. The function decides the second type.\nstatic TResult Transform<TSource, TResult>(TSource input, Func<TSource, TResult> map)\n    => map(input);\n\n// In a web API you do this constantly: turn an entity into a DTO.\nrecord Product(int Id, string Name, decimal Price);\nrecord ProductDto(int Id, string Label);\n\nvar product = new Product(7, \"Keyboard\", 49.99m);\nProductDto dto = Transform(product, p => new ProductDto(p.Id, p.Name.ToUpper()));\nConsole.WriteLine($\"{dto.Id}: {dto.Label}\");\n\n// Same method, totally different types — inferred from the lambda's return.\nint nameLength = Transform(product, p => p.Name.Length);\nConsole.WriteLine($\"Name length: {nameLength}\");"
    },
    {
      "kind": "output",
      "output": "7: KEYBOARD\nName length: 8"
    },
    {
      "kind": "paragraph",
      "text": "Notice the inference is still doing all the work: from `product` the compiler knows `TSource` is `Product`, and from what each lambda *returns* it knows `TResult` is `ProductDto` in the first call and `int` in the second (`\"Keyboard\"` has 8 letters). This `Transform` is essentially a one-item version of LINQ's `Select` — and that's not a coincidence. The entire LINQ library you'll learn next is built from generic methods exactly like this."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A second example: `Max<T>`",
      "id": "max-example"
    },
    {
      "kind": "paragraph",
      "text": "Swapping doesn't care *what* `T` is — any type can be moved around. But many useful methods need `T` to support some operation. Finding the larger of two values needs comparison, and not every type is comparable. The cleanest way to write a generic `Max` that compiles today is to lean on the built-in `Comparer<T>.Default`, which knows how to compare any type that is naturally orderable (numbers, strings, dates, and more)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Max.cs",
      "code": "static T Max<T>(T a, T b)\n    => Comparer<T>.Default.Compare(a, b) >= 0 ? a : b;\n\nConsole.WriteLine(Max(3, 9));                 // int\nConsole.WriteLine(Max(\"apple\", \"banana\"));    // string, alphabetical\nConsole.WriteLine(Max(4.5, 4.49));            // double\n\nvar release = new DateOnly(2026, 11, 11);\nvar today = new DateOnly(2026, 6, 20);\n// ISO format again, so the printed result is the same everywhere.\nConsole.WriteLine(Max(release, today).ToString(\"yyyy-MM-dd\"));"
    },
    {
      "kind": "output",
      "output": "9\nbanana\n4.5\n2026-11-11"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: you can't just write `a > b` inside `Max<T>`",
      "text": "Beginners try `return a > b ? a : b;` and get a compile error like *\"Operator '>' cannot be applied to operands of type 'T' and 'T'.\"* That's because the compiler only knows what *every possible* `T` can do — and not every type supports `>`. To unlock operations like `>` or `.CompareTo`, you give the method a **constraint** (e.g. `where T : IComparable<T>`), which is the subject of the next lesson. For now, `Comparer<T>.Default` sidesteps the issue and is exactly what a lot of production code uses anyway."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The payoff: real type safety, zero casting",
      "id": "type-safety"
    },
    {
      "kind": "paragraph",
      "text": "Here's the whole point in one screen. The generic version catches your mistakes at **compile time** — before the program ever runs — and never makes you cast. The `object` version compiles the same mistake and then detonates at runtime. This is the difference between \"the build is red on my machine\" and \"the API 500s in production on a Friday.\""
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Generic — bug caught at compile time",
          "items": [
            "`static T Echo<T>(T value) => value;`",
            "`int n = Echo(42);` — `T` is `int`, no cast.",
            "`string s = Echo(42);` — **does not compile** (error CS0029: can't convert `int` to `string`).",
            "No boxing: an `int` stays a real `int`.",
            "Your IDE gives full autocomplete on the result."
          ]
        },
        {
          "title": "object — bug hidden until runtime",
          "items": [
            "`static object Echo(object value) => value;`",
            "`int n = (int)Echo(42);` — must cast every time.",
            "`string s = (string)Echo(42);` — **compiles**, throws `InvalidCastException` at run time.",
            "Boxing: every value type allocates a wrapper.",
            "No autocomplete — the result is just `object`."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "C# generics are 'reified' — the type survives to runtime",
      "text": "Unlike Java (which erases generic types) and unlike Python (whose hints vanish at runtime), C# **keeps `T` at runtime**. That's why `List<int>` stores real `int`s with no boxing, and why advanced code can ask `typeof(T)` or write `default(T)`. You don't need this on day one, but it's the technical reason C#'s generics are genuinely type-safe and fast rather than a polite convention. Interviewers love this distinction."
    },
    {
      "kind": "examples",
      "intro": "A few more tiny generic methods you'll recognize from everyday .NET — each is one method serving many types:",
      "examples": [
        {
          "label": "Wrap a value so 'no result' is impossible to confuse with a real value",
          "code": "static (bool Found, T Value) TryPick<T>(T[] items, int index)\n    => index >= 0 && index < items.Length\n        ? (true, items[index])\n        : (false, default!);\n\nvar (found, value) = TryPick(new[] { \"a\", \"b\" }, 1);\nConsole.WriteLine($\"{found}: {value}\");",
          "output": "True: b"
        },
        {
          "label": "Identity / passthrough — the simplest generic there is",
          "code": "static T Identity<T>(T value) => value;\nConsole.WriteLine(Identity(99));\nConsole.WriteLine(Identity(\"hi\"));",
          "output": "99\nhi"
        },
        {
          "label": "Build a list from loose arguments (params + inference)",
          "code": "static List<T> ListOf<T>(params T[] items) => new(items);\nList<int> nums = ListOf(1, 2, 3);   // T inferred as int\nConsole.WriteLine(string.Join(\", \", nums));",
          "output": "1, 2, 3"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: name type parameters for what they mean",
      "text": "Use bare `T` only for the obvious single-type case (`Swap<T>`, `Identity<T>`). The moment you have a relationship between types, name them: `TSource`/`TResult` for a transform, `TKey`/`TValue` for a lookup, `TEntity` for a repository method. Good names turn a signature like `Transform<TSource, TResult>(...)` into self-documenting code — anyone reading it knows immediately which type flows where."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Generics solve duplication **without** sacrificing type safety — they replace per-type copies (`SwapInts`, `SwapStrings`) and the unsafe `object`-plus-casting workaround.",
        "Declare a generic method with a type parameter in angle brackets after the name: `void Swap<T>(ref T a, ref T b)`. Inside, `T` is a real type you can use anywhere.",
        "**Type inference** means you rarely write the `<T>` — call `Swap(ref a, ref b)` and the compiler reads `T` from the arguments. You only spell it out when `T` appears solely in the return type.",
        "Use **multiple type parameters** with meaningful names (`TKey`, `TValue`, `TSource`, `TResult`) when types relate to each other, as in `Transform<TSource, TResult>`.",
        "Generics are checked at **compile time** and preserved at runtime (reified), so `Echo<string>(42)` won't even compile — versus the `object` version that compiles and throws at runtime.",
        "Some generics need `T` to support an operation (like comparison in `Max<T>`). Use `Comparer<T>.Default` for now; **constraints** unlock operators like `>` and are the next lesson.",
        "When you print a date or number that someone else will read, format it explicitly (e.g. `:yyyy-MM-dd`) — the default `ToString()` is culture-dependent and varies by machine.",
        "Versus Python: same write-once power, but C#'s type parameters are enforced guarantees, not optional hints — and value types avoid boxing entirely."
      ]
    }
  ]
};
