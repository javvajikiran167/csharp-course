import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "constraints",
  "number": 3,
  "title": "Type Constraints",
  "objective": "Constrain type parameters with where clauses so the compiler lets you use members of T safely.",
  "blocks": [
    {
      "kind": "lead",
      "text": "A bare `T` is a stranger to the compiler — it knows nothing about it except that it exists. The moment you want to *do* something with that `T` (compare it, create one, call a method on it), you have to introduce them properly. That introduction is a **constraint**."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by reminding students of the previous lessons: they can now write `Box<T>` and `Swap<T>`, but those only *store* and *move* values — they never *use* them. This lesson is the leap from passive containers to generics that actually operate on `T`.",
        "The single most important mental model to install: inside a generic method, the compiler assumes `T` could be **literally any type**, so it only lets you do what *every* type supports (assign it, pass it around, call `ToString`/`Equals`/`GetHashCode` from `object`). A constraint is a promise that narrows 'any type' down to 'any type that also has X', and in return the compiler unlocks X.",
        "Live-code the failure first: write `Max<T>` with no constraint and the naive `a > b`, watch it fail with **CS0019**, then introduce `IComparable<T>` and `CompareTo` and watch it light up. The before/after is far more memorable than showing the finished version. (Heads-up: if you instead demo the unconstrained `a.CompareTo(b)`, .NET 10 emits a *noisy* CS7036 about a `MemoryExtensions`/`ReadOnlySpan<char>` span overload rather than the clean 'T has no CompareTo' message — the `>` route gives the cleaner teaching error, which is why the lesson uses it.)",
        "Python contrast lands well here: in Python `max(a, b)` 'works' until it explodes at runtime with `TypeError`. Emphasise that C# moves that failure from 3am-in-production to the moment you type the code.",
        "Don't drown them in all constraint kinds at once. Teach the four they'll actually use weekly — `IComparable<T>`, `class`/`struct`, `new()`, `notnull` — and mention the rest as 'you'll recognise these when you meet them.'",
        "If time allows, show the exact compiler error text (CS0019 for the operator, CS0401/CS0449 for bad constraint ordering) so they can recognise it later; 'the compiler is telling you it needs a constraint' is a skill, not just trivia."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why constraints exist at all",
      "id": "why-constraints"
    },
    {
      "kind": "paragraph",
      "text": "In Python, generics are a suggestion. You can write `def biggest(a, b): return a if a > b else b` and it runs for anything that supports `>`. If you pass two things that *don't*, you find out at runtime with a `TypeError`. C# refuses to gamble. When you write `T`, the compiler treats it as **the most restrictive type imaginable** — it will only let you use the handful of members that *every single type in .NET* is guaranteed to have: the ones inherited from `object` (`ToString()`, `Equals()`, `GetHashCode()`). Anything beyond that, and the compiler says no."
    },
    {
      "kind": "paragraph",
      "text": "Watch what happens when we try to write a `Max<T>` the naive way — exactly the code a Python developer would expect to work, using the `>` operator to find the bigger value:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "T Max<T>(T a, T b)\n{\n    // We want \"return the bigger one\" — but how does the compiler\n    // know T even SUPPORTS the > operator?\n    return a > b ? a : b;\n}",
      "filename": "Broken.cs"
    },
    {
      "kind": "output",
      "label": "Compiler error",
      "output": "error CS0019: Operator '>' cannot be applied to operands of type 'T' and 'T'"
    },
    {
      "kind": "paragraph",
      "text": "The compiler isn't being difficult — it's being honest. As far as it knows, `T` might be `int`, or `Customer`, or `HttpClient`, or some type that doesn't exist yet. Most types don't define a `>` operator, so it cannot let you use one. A **constraint** is how you make a promise: *\"I will only ever call this with a `T` that knows how to compare itself.\"* Once you make that promise with a `where` clause, the compiler trusts it and unlocks the comparison."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "The deal in one sentence",
      "text": "A constraint *restricts* who can use your generic (fewer types qualify) in exchange for *expanding* what you can do inside it (more members become available). You give up generality to gain capability — and you choose exactly how much."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The classic: where T : IComparable<T> and a real Max",
      "id": "icomparable"
    },
    {
      "kind": "paragraph",
      "text": "The fix is one line — plus a small shift in *how* we compare. `IComparable<T>` is the standard .NET interface for \"a type that can compare itself to another of its kind.\" It has exactly one method, `int CompareTo(T other)`, which returns a **negative** number if `this` is smaller, **zero** if they're equal, and a **positive** number if `this` is bigger. Crucially, `int`, `double`, `decimal`, `string`, `DateTime`, `TimeSpan`, `Guid`, and many more **already implement it**. So constraining to it costs us almost nothing in practice while making the method type-safe."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "T Max<T>(T a, T b) where T : IComparable<T>\n{\n    // Now the compiler KNOWS every T has CompareTo(T). It compiles.\n    return a.CompareTo(b) > 0 ? a : b;\n}\n\nConsole.WriteLine(Max(3, 9));            // works: int implements IComparable<int>\nConsole.WriteLine(Max(\"apple\", \"pear\")); // works: string implements IComparable<string>\nConsole.WriteLine(Max(2.5, 1.5));        // works: double too",
      "filename": "Program.cs"
    },
    {
      "kind": "output",
      "output": "9\npear\n2.5"
    },
    {
      "kind": "paragraph",
      "text": "Read the `where` clause out loud: *\"where T is constrained to IComparable of T.\"* It sits after the parameter list and before the method body (or the class's opening brace). The payoff is that `Max` now works for *every* comparable type — present and future. If your company defines a `Money` struct and implements `IComparable<Money>`, your year-old `Max` method suddenly works for `Money` with zero changes. That is the real-world power: one battle-tested helper instead of `MaxInt`, `MaxDouble`, `MaxMoney`."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: comparing goes through CompareTo, not >",
      "text": "Notice we had to *change the body* — `a > b` became `a.CompareTo(b) > 0`. The `>` operator is **not** part of `IComparable<T>`, so even after constraining, `return a > b ? a : b;` still fails with **CS0019**. There's no `where` clause that unlocks `>` for arbitrary types — operator support lives in generic math's `INumber<T>` (a later topic), which only fits numeric types. For ordering *any* comparable type — including strings and dates — you go through `CompareTo`. Same idea, different doorway: the interface gives you a *method*, not an *operator*."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The everyday constraints: class, struct, and new()",
      "id": "class-struct-new"
    },
    {
      "kind": "paragraph",
      "text": "Three more constraints show up constantly in real codebases. Each unlocks a specific capability:"
    },
    {
      "kind": "list",
      "items": [
        "**`where T : class`** — T must be a **reference type** (a class, interface, delegate, or array). This lets you assign `null` to a `T` and is the bread-and-butter constraint for repositories and services that deal in entities/objects, never raw numbers.",
        "**`where T : struct`** — T must be a **value type** (`int`, `bool`, `DateTime`, your own structs, enums). This is how the built-in `Nullable<T>` is defined — `int?` is really `Nullable<int>`, and `Nullable<T>` is declared `where T : struct`.",
        "**`where T : new()`** — T must have a **public parameterless constructor**, which lets you write `new T()` inside the method. Handy for factories and deserialization helpers that need to build a fresh instance.",
        "**`where T : notnull`** — T must be a **non-nullable** type (either a non-nullable reference type or a value type). It's how `Dictionary<TKey, TValue>` declares its key (`where TKey : notnull`) so you can't use a possibly-null key."
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// new() lets us construct a fresh T — a tiny factory.\nT CreateDefault<T>() where T : new() => new T();\n\nvar list = CreateDefault<List<string>>(); // builds an empty List<string>\nlist.Add(\"hello\");\nConsole.WriteLine(list.Count);             // 1\n\n// struct constraint: only value types allowed.\nbool IsDefault<T>(T value) where T : struct\n    => value.Equals(default(T));\n\nConsole.WriteLine(IsDefault(0));                 // True  (0 is default(int))\nConsole.WriteLine(IsDefault(DateTime.MinValue)); // True  (MinValue is default(DateTime))\nConsole.WriteLine(IsDefault(5));                 // False",
      "filename": "Program.cs"
    },
    {
      "kind": "output",
      "output": "1\nTrue\nTrue\nFalse"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: new() can't pass arguments",
      "text": "The `new()` constraint only promises a **parameterless** constructor. Inside the method you can write `new T()` but never `new T(someArg)` — there's no constraint that guarantees a constructor with parameters. If you need richer construction, pass in a factory delegate (`Func<T>`) instead. This trips people up the first time they try to write a generic factory that needs initialization data."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Base class and interface constraints",
      "id": "base-class"
    },
    {
      "kind": "paragraph",
      "text": "You can require that `T` derives from a specific base class or implements a specific interface. This is the backbone of generic repositories and service layers — patterns you'll meet in nearly every ASP.NET Core business app. Suppose every entity in your system has an `Id`:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "public interface IEntity\n{\n    int Id { get; }\n}\n\npublic record Customer(int Id, string Name) : IEntity;\npublic record Product(int Id, string Title) : IEntity;\n\n// T must implement IEntity, so the compiler lets us read x.Id.\npublic static class Repo\n{\n    public static T? FindById<T>(IEnumerable<T> items, int id) where T : IEntity\n        => items.FirstOrDefault(x => x.Id == id);\n}\n\nvar customers = new[] { new Customer(1, \"Ada\"), new Customer(2, \"Linus\") };\nConsole.WriteLine(Repo.FindById(customers, 2)?.Name ?? \"not found\");",
      "filename": "Program.cs"
    },
    {
      "kind": "output",
      "output": "Linus"
    },
    {
      "kind": "paragraph",
      "text": "Because of `where T : IEntity`, the compiler knows every `T` exposes `Id`, so `x.Id == id` compiles. Without the constraint, `x.Id` would be an error — a plain **CS1061: 'T' does not contain a definition for 'Id'**. A base-class constraint works identically; you'd write `where T : EntityBase` and gain access to every public/protected member of `EntityBase`. This single generic method now serves `Customer`, `Product`, and every future entity, which is exactly why the generic repository pattern is everywhere in enterprise C#."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Combining multiple constraints",
      "id": "multiple-constraints"
    },
    {
      "kind": "paragraph",
      "text": "Real methods often need several promises at once. You can stack constraints on a single type parameter (comma-separated) and constrain multiple type parameters (one `where` clause each). There is a **required order** within a single clause: the primary constraint first (`class`, `struct`, `notnull`, or a base class), then any interfaces, then `new()` last."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// T must be a reference type, implement IEntity, AND be constructible.\n// Order matters: class -> interface -> new()\npublic static T Hydrate<T>() where T : class, IEntity, new()\n    => new T();\n\n// Two type parameters, each with its own where clause.\npublic static Dictionary<TKey, TValue> ToIndex<TKey, TValue>(\n        IEnumerable<TValue> items, Func<TValue, TKey> keySelector)\n    where TKey : notnull\n    where TValue : class\n    => items.ToDictionary(keySelector);",
      "filename": "Program.cs"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Legal ordering",
          "items": [
            "`where T : class, IComparable<T>, new()`",
            "`where T : BaseClass, IEntity`",
            "`where T : struct, IComparable<T>`",
            "`where TKey : notnull` + separate `where TValue : class`"
          ]
        },
        {
          "title": "Illegal / won't compile",
          "items": [
            "`where T : new(), IEntity` — `new()` must be last (CS0401)",
            "`where T : IEntity, class` — primary constraint must be first (CS0449)",
            "`where T : class, struct` — can't be both reference and value type (CS0449)",
            "`where T : SomeClass, AnotherClass` — only one base class allowed"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: constrain to exactly what you use — no more, no less",
      "text": "Add the *minimum* constraints your method actually needs. Each constraint is both documentation (it tells callers what's required) and a key (it unlocks members). Under-constrain and your code won't compile; over-constrain and you needlessly turn away valid callers. If you only call `CompareTo`, require `IComparable<T>` — don't also demand `class` or `new()` 'just in case.' Treat the `where` clause as the honest contract of your generic."
    },
    {
      "kind": "examples",
      "intro": "A quick tour of which member each constraint unlocks — the mapping worth memorising:",
      "examples": [
        {
          "label": "IComparable<T> unlocks ordering",
          "code": "T Min<T>(T a, T b) where T : IComparable<T>\n    => a.CompareTo(b) < 0 ? a : b;\n\nConsole.WriteLine(Min(7, 2));   // 2",
          "output": "2"
        },
        {
          "label": "new() unlocks construction",
          "code": "T Make<T>() where T : new() => new T();\nConsole.WriteLine(Make<int>());             // 0\nConsole.WriteLine(Make<List<int>>().Count); // 0",
          "output": "0\n0"
        },
        {
          "label": "class unlocks null assignment",
          "code": "T? FirstOrNull<T>(IEnumerable<T> xs) where T : class\n    => xs.FirstOrDefault();\nConsole.WriteLine(FirstOrNull(new string[0]) ?? \"<null>\"); // <null>",
          "output": "<null>"
        },
        {
          "label": "Interface constraint unlocks its members",
          "code": "void Reset<T>(T item) where T : System.IDisposable\n    => item.Dispose();   // Dispose() is now callable on T"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: notnull over class when you only mean \"not null\"",
      "text": "If your real requirement is just \"don't hand me null\" — like a dictionary key — prefer `where T : notnull` rather than `where T : class`. `class` excludes all value types (so `int` keys would be rejected), whereas `notnull` happily accepts `int`, `Guid`, and non-nullable strings alike. Choosing the narrowest *accurate* constraint keeps your generic usable by the widest correct set of callers. This is exactly the choice the BCL made for `Dictionary<TKey, TValue>`."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Inside a generic, the compiler assumes `T` could be **any** type, so it only allows `object` members until you make a promise.",
        "A `where` clause is that promise: it **restricts which types qualify** in exchange for **unlocking members** you can call on `T`.",
        "`where T : IComparable<T>` is the classic — it's what makes a real generic `Max<T>`/`Min<T>` possible via `CompareTo` (you cannot use `>` on a bare `T` — that's CS0019).",
        "`class` (reference type, allows null), `struct` (value type), and `new()` (constructible with `new T()`) are the everyday workhorses; `notnull` means \"non-null, value or reference.\"",
        "Base-class and interface constraints (`where T : IEntity`) power the generic repository/service patterns you'll see throughout business apps.",
        "Stack constraints in the required order — primary (`class`/`struct`/base class) first, interfaces next, `new()` last — and give each type parameter its own `where` clause.",
        "Constrain to exactly what you use: too little won't compile, too much turns away valid callers."
      ]
    }
  ]
};
