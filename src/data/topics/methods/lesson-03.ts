import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "overloading",
  "number": 3,
  "title": "Method Overloading",
  "objective": "Define multiple methods with the same name but different signatures, and understand how the compiler picks one (overload resolution).",
  "blocks": [
    {
      "kind": "lead",
      "text": "You have used `Console.WriteLine` to print an `int`, a `string`, a `bool`, and a `double` — all with the *same* method name. That is no accident: it is **method overloading**, one of the first C# features you meet and one Python simply does not have."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Lead with the `Console.WriteLine` hook — students have already been calling overloads without knowing it. Make that 'aha' moment explicit early.",
        "The single hardest idea to land: **the return type is NOT part of the signature.** Drill it. Show the compile error live if you can.",
        "Python students have no mental model for this at all — Python's 'last `def` wins' is the closest thing and it's the *opposite* behaviour. Spend a moment on the twoColumn comparison.",
        "**Gotcha for live demos:** local functions cannot be overloaded (you get CS0128). Every overload-set demo in this lesson lives inside a `static class` for exactly this reason. If a student tries to overload two local functions in a top-level `Program.cs`, that's the error they'll hit — it's a great teachable moment about *where* overloads are allowed.",
        "Overload resolution can rabbit-hole into spec minutiae. Teach the 80% intuition ('compiler picks the most specific match that needs the fewest conversions') and stop there; flag the C# 14 span change as 'know it exists', not memorise.",
        "If short on time, the must-haves are: what/why, signature definition, the return-type rule, ambiguity, and `Console.WriteLine`. The by-value-vs-by-ref and named-args nuance can be skimmed."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What overloading is — and why it exists",
      "id": "what-and-why"
    },
    {
      "kind": "paragraph",
      "text": "**Method overloading** means defining two or more methods with the **same name** in the same type, distinguished by their **parameter lists**. The compiler treats them as separate methods that happen to share a name, and at each call site it picks the one that best fits the arguments you passed. You have been relying on this since lesson one: [`Console.WriteLine`](https://learn.microsoft.com/dotnet/api/system.console.writeline) ships with around twenty overloads — one for `int`, one for `string`, one for `double`, one for `object`, one for `char[]`, and so on. That is why `Console.WriteLine(42)` and `Console.WriteLine(\"hi\")` both 'just work'."
    },
    {
      "kind": "paragraph",
      "text": "Why bother? Because the alternative is ugly. Without overloading you would need a different name for every input type — `PrintInt`, `PrintString`, `PrintDouble` — and callers would have to remember which is which. Overloading lets one **clear, intention-revealing name** describe one **concept** (\"write a value to the console\") while the type system quietly routes each call to the right implementation. It is reuse at the level of *naming*: the same idea, expressed once, applied to many shapes of data."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python: no overloading",
          "items": [
            "Defining `def area(...)` twice just **rebinds the name** — the *last* `def` wins; the first is gone.",
            "You fake variety with default args (`def area(w, h=None)`), `*args`, or [`functools.singledispatch`](https://docs.python.org/3/library/functools.html#functools.singledispatch).",
            "One function object lives behind the name at runtime; dispatch (if any) happens *inside* the function, at runtime, based on values you inspect by hand."
          ]
        },
        {
          "title": "C#: real overloading",
          "items": [
            "Multiple methods named `Area` **coexist**, each a distinct method with its own signature.",
            "The **compiler** picks one at compile time based on the argument types — zero runtime cost and full IntelliSense/type-checking.",
            "Pervasive in the BCL: `Math.Max`, `Convert.ToInt32`, `string.Format`, and `Console.WriteLine` are all heavily overloaded."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The signature: what actually distinguishes overloads",
      "id": "the-signature"
    },
    {
      "kind": "paragraph",
      "text": "An overload set is legal only if the methods differ by their **signature**. For overloading purposes, a method's signature is its **name plus the number, types, modifiers, and order of its parameters**. Two things are deliberately *not* part of it: the **return type**, and the **parameter names**. This is the rule that catches everyone, so let's see it concretely. (Note: overloading is for *type members* — overloaded methods must live inside a class, struct, or interface. You cannot overload top-level **local functions**; the compiler rejects a second one with the same name.)"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Geometry.cs",
      "code": "public static class Geometry\n{\n    // Different parameter COUNT  -> distinct overloads. OK.\n    public static double Area(double side) => side * side;            // square\n    public static double Area(double width, double height) => width * height; // rectangle\n\n    // Different parameter TYPES -> distinct overloads. OK.\n    public static double Area(int radius) => Math.PI * radius * radius; // crude circle\n\n    // Different parameter ORDER of types -> distinct signature. OK (though questionable design).\n    public static string Describe(string label, double value) => $\"{label}: {value}\";\n    public static string Describe(double value, string label) => $\"{value} ({label})\";\n}"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Illegal.cs",
      "code": "public static class Illegal\n{\n    public static int    Parse(string s) => int.Parse(s);\n    public static double Parse(string s) => double.Parse(s); // ERROR: only the RETURN TYPE differs\n\n    // Parameter NAMES don't count either - these two have the SAME signature:\n    public static void Send(string message) { }\n    public static void Send(string body)    { } // ERROR: 'Send' is already defined\n}"
    },
    {
      "kind": "output",
      "label": "Compiler errors from Illegal.cs",
      "output": "error CS0111: Type 'Illegal' already defines a member called 'Parse' with the same parameter types\nerror CS0111: Type 'Illegal' already defines a member called 'Send' with the same parameter types"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: return type is NOT part of the signature",
      "text": "You **cannot** create two overloads that differ only by what they return. If the compiler allowed `int Parse(string)` and `double Parse(string)`, then a call like `Parse(\"42\")` used as a statement (with the result ignored) would be hopelessly ambiguous — there is nothing at the call site to disambiguate by. The same logic rules out parameter *names*: `Send(string message)` and `Send(string body)` are the identical signature `Send(string)`. **Differ by parameter types/count/order, never by return type or names.**"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What about ref, out, and in?",
      "id": "ref-out-in"
    },
    {
      "kind": "paragraph",
      "text": "Parameter **modifiers** can distinguish overloads, with one sharp caveat. A by-value parameter and a by-reference one *do* form distinct signatures, so `void Swap(int a, int b)` and `void Swap(ref int a, ref int b)` can coexist. But `ref`, `out`, and `in` are considered the *same* for this purpose: you **cannot** overload `Process(ref int x)` against `Process(out int x)`. That is compile error **CS0663** (\"cannot define an overloaded method that differs only on parameter modifiers 'out' and 'ref'\"), because at the call site they would be indistinguishable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Overload resolution: how the compiler chooses",
      "id": "overload-resolution"
    },
    {
      "kind": "paragraph",
      "text": "When you call an overloaded method, the compiler runs **overload resolution** entirely at compile time. The 80% intuition you need is short: it gathers every overload that *could* accept your arguments (the **applicable candidates**), then picks the **most specific** one — the one needing the **fewest, cheapest type conversions**. An exact type match always beats a match that requires a conversion. If exactly one best candidate exists, it wins. If none apply, you get a compile error. If two are equally good, you get an **ambiguity** error."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "Demo.Show(10);       // exact match -> int\nDemo.Show(3.5);      // exact match -> double\nDemo.Show(10L);      // no int match (long->int would lose data); long widens to double -> double\nDemo.Show(\"hello\");  // only object accepts a string -> object\n\nstatic class Demo\n{\n    public static void Show(int n)    => Console.WriteLine($\"int overload: {n}\");\n    public static void Show(double d) => Console.WriteLine($\"double overload: {d}\");\n    public static void Show(object o) => Console.WriteLine($\"object overload: {o}\");\n}"
    },
    {
      "kind": "output",
      "label": "Program output",
      "output": "int overload: 10\ndouble overload: 3.5\ndouble overload: 10\nobject overload: hello"
    },
    {
      "kind": "paragraph",
      "text": "Read that third call carefully. A `long` does not fit into an `int` (that would lose data, so the compiler won't do it silently), but it *does* widen to `double`. So `Show(10L)` binds to the `double` overload — printing `double overload: 10`. The fourth call has only one applicable candidate (`object`), so a `string` flows there. This 'most specific wins, then fewest conversions' rule is exactly how `Console.WriteLine(42)` reaches the `int` overload instead of the catch-all `object` one. (Notice the methods live inside `Demo`: overload sets must be type members — you can't overload two local functions.)"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "When the compiler gives up: ambiguity errors",
      "id": "ambiguity"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Ambiguous.cs",
      "code": "L.Log(1, 2); // Two ints. Each overload needs ONE int->long widening.\n             // Neither is 'more specific' than the other -> CS0121.\n\nstatic class L\n{\n    public static void Log(int code, long detail) => Console.WriteLine(\"first\");\n    public static void Log(long code, int detail) => Console.WriteLine(\"second\");\n}"
    },
    {
      "kind": "output",
      "label": "Compiler error",
      "output": "error CS0121: The call is ambiguous between the following methods or properties:\n'L.Log(int, long)' and 'L.Log(long, int)'"
    },
    {
      "kind": "paragraph",
      "text": "Here `L.Log(1, 2)` passes two `int` literals. The first overload needs to widen the *second* argument `int`→`long`; the second overload needs to widen the *first* argument `int`→`long`. Both cost exactly one widening conversion, so neither is strictly better — the compiler refuses to guess and reports **CS0121**. The fix is to remove the genuine ambiguity at the call site, usually with an explicit cast (`L.Log(1, 2L)` or `L.Log((long)1, 2)`) that makes one candidate clearly the best match."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Overloading in real code",
      "id": "real-world"
    },
    {
      "kind": "examples",
      "intro": "Overloading is everywhere in professional .NET. A few patterns you'll meet and write constantly (each helper lives in a `static class` because overloads must be type members):",
      "examples": [
        {
          "label": "BCL: Math.Max picks the right numeric type",
          "code": "int a = Math.Max(3, 7);          // Max(int, int)\ndouble b = Math.Max(3.0, 7.5);   // Max(double, double)\nConsole.WriteLine($\"{a} {b}\");",
          "output": "7 7.5"
        },
        {
          "label": "App code: convenience overloads delegate to one 'real' method",
          "code": "Console.WriteLine(Billing.Price(100m));        // no tax\nConsole.WriteLine(Billing.Price(100m, 0.2m));  // 20% tax\n\nstatic class Billing\n{\n    public static decimal Price(decimal amount) => Price(amount, taxRate: 0.0m);\n    public static decimal Price(decimal amount, decimal taxRate) => amount * (1 + taxRate);\n}",
          "output": "100.0\n120.0"
        },
        {
          "label": "ASP.NET-style: same action, different lookup keys",
          "code": "Console.WriteLine(Users.Find(7));\nConsole.WriteLine(Users.Find(\"ada@x.io\"));\n\nstatic class Users\n{\n    public static string Find(int id)     => $\"user #{id}\";\n    public static string Find(string em)  => $\"user with email {em}\";\n}",
          "output": "user #7\nuser with email ada@x.io"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why does Price(100m) print 100.0, not 100?",
      "text": "`decimal` tracks **scale** (the number of digits after the point) as part of the value. `Price(100m)` forwards to `Price(100m, 0.0m)`, which computes `100m * (1 + 0.0m)`. Here `1 + 0.0m` is `1.0` (one decimal place), and multiplying `decimal`s **adds their scales**, so `100m * 1.0m` yields `100.0`. The default `ToString()` for `decimal` preserves that trailing zero — which is exactly the behaviour you want for money. If you need a fixed display format, format it explicitly, e.g. `amount.ToString(\"C\")` or `$\"{amount:0.00}\"`."
    },
    {
      "kind": "paragraph",
      "text": "Notice the middle example: a very common professional pattern is to write **one** method that does the real work and have the other overloads **forward** to it with sensible defaults. This keeps the logic in a single place (so there is only one thing to test and fix) while still offering callers a friendly, short-form signature. You will see this all over framework startup code, repository methods, and builder APIs."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: don't mix overloads with optional parameters",
      "text": "C# offers a *second* way to make a method callable several ways — **optional parameters** (`decimal Price(decimal amount, decimal taxRate = 0m)`). Both solve the 'fewer arguments' problem, but **mixing them in the same overload set** creates surprising, sometimes ambiguous overload resolution. Microsoft's guidance: pick one approach per method family. Prefer **overloads** for *public library* APIs (optional-parameter default values get baked into the *caller's* compiled code, so changing a default later doesn't take effect until callers recompile — a classic versioning bug), and reserve optional parameters for internal app code you always recompile together. Keep overloads few, consistent, and obviously different."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Heads-up for .NET 10 upgrades",
      "text": "C# 14 / .NET 10 refined overload-resolution rules so that high-performance `Span<T>`/`ReadOnlySpan<T>` overloads in the BCL become applicable in more situations (part of the ongoing 'first-class spans' work). This is a documented, intentional change: a call that previously bound to, say, an `IEnumerable<T>` overload might now bind to a faster `ReadOnlySpan<T>` one after upgrading. It's almost always an improvement, but if you ever see behaviour shift purely from a framework upgrade, overload binding is a place worth checking."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Overloading** = several methods with the *same name* but *different parameter lists* in one type; the compiler routes each call to the best fit. Python has no equivalent — its last `def` simply wins.",
        "Overloads must be **type members** (class/struct/interface). You **cannot** overload top-level *local functions* — a second one with the same name is a compile error.",
        "A **signature** for overloading is *name + parameter types/count/order/modifiers*. The **return type and parameter names are NOT part of it** — you can't overload on those.",
        "By-value vs by-reference parameters form distinct signatures, but `ref`, `out`, and `in` count as the *same* and can't overload against each other (**CS0663**).",
        "**Overload resolution** runs at compile time: gather applicable candidates, pick the *most specific* (fewest/cheapest conversions). Exact type match beats a widening conversion.",
        "If no candidate fits you get a compile error; if two tie you get an **ambiguity error (CS0121)** — fix it with an explicit cast at the call site.",
        "Real-world pattern: write one 'real' method and have other overloads forward to it. Prefer overloads over optional parameters for public APIs, and don't mix the two."
      ]
    }
  ]
};
